const socket = io();
const messages = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');

// Temporary only, demonstrate the login connection workability
socket.on('connect', () => {
  console.log('socket.id', socket.id);
});

// 單一上線使用者資料
socket.on('userJoined', (user) => {
  console.log('userJoinedName', user);
});

if (chatForm !== null) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.value) {
      socket.emit('chat message', chatInput.value);
      chatInput.value = '';
    }
  });
}

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
