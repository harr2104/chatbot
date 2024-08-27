const socket = io();

const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const voiceButton = document.getElementById('voice-button');

function appendMessage(type, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + type + '-message';
  messageDiv.textContent = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener('click', () => {
  const prompt = messageInput.value;
  if (prompt.trim() === '') return;

  appendMessage('user', prompt);
  messageInput.value = '';

  socket.emit('message', prompt);
});

socket.on('message', (data) => {
  appendMessage(data.type, data.text);
});

socket.on('error', (message) => {
  appendMessage('bot', message);
});

// Voice recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-IN';
recognition.interimResults = false;

voiceButton.addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('result', (event) => {
  const speechToText = event.results[0][0].transcript;
  messageInput.value = speechToText;

  appendMessage('user', speechToText);
  socket.emit('message', speechToText);
});

recognition.addEventListener('end', () => {
  recognition.stop();
});

recognition.addEventListener('error', (event) => {
  appendMessage('bot', 'Voice recognition error: ' + event.error);
});
