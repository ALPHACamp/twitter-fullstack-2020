const socket = io();
const messages = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');

// Temporary only, demonstrate the login connection workability
socket.on('connect', () => {
  console.log('socket.id', socket.id);
});

// 單一上線使用者資料
socket.on('joined', (user) => {
  console.log('user joined', user);
});

// 同時在線使用者有誰
socket.on('userJoined', (onlineUsers) => {
  console.log('onlineUsers', onlineUsers);
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
  item.innerHTML = `
    <div class="d-flex align-items-end">
      <img id="chat-user-avatar" class="rounded-circle mr-2" src="https://i.imgur.com/AoWNOVG.jpg" alt="">
        <div id="chat-bubble" class="item-desc pt-2 pb-1">
          ${msg}
        </div>
       </div>
      <div id="chat-createdAt" class="ml-5">下午5:00</div>
    </div>
  `
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
