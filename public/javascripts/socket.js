const socket = io();
const messages = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const { userId } = document.querySelector('#column_main').dataset;

socket.emit('login', userId);

// 通知哪位用戶上線了
socket.on('loginSuccess', (onlineUser) => {
  const item = document.createElement('li');
  item.textContent = `${onlineUser.name} 上線了`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

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
