const socket = io();
const messages = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (chatInput.value) {
    socket.emit('chat message', chatInput.value);
    chatInput.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
