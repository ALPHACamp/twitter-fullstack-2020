const socket = io();
const messages = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatUserList = document.querySelector('#chat-user-list');

// Temporary only, demonstrate the login connection workability
socket.on('connect', () => {
  console.log('socket.id', socket.id);
});

// 使用者已上線, 會同時推送上線的使用者，以及這個使用者加入的房間裡的用戶 array
socket.on('userJoined', (userObj) => {
  const { usersInRoom } = userObj;
  document.querySelector('#chatroom-user-count').innerHTML = usersInRoom.length;

  // 使用者上線提示
  const item = document.createElement('li');
  item.innerHTML = ` ${userObj.user.name} 上線 `;
  // item.setAttribute('class','mx-auto');
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);

  // 傳送上線使用者資料
  const userItem = document.createElement('div');
  let rawHTML = '';
  usersInRoom.forEach((user) => {
    rawHTML += `
    <div class="d-flex flex-row no-wrap align-items-star pb-1">
      <a class="profile-img mr-3" href="/users/${user.id}/tweets"> 
        <img class="img-fluid rounded-circle" src="${user.avatar}" alt=""> 
      </a>
      <div class="item-header d-flex d-column no-wrap justify-content-start align-items-center">
        <div class="name w-100 pr-2">
          <a href="/users/${user.id}/tweets class="text-dark text-decoration-none">${user.name}</a>
        </div>
        <div class="item-username">
          <a href="/chatroom/${user.id}" class="text-dark text-decoration-none">
            <span class="username text-lightgrey">@${user.account}</span>
          </a>
        </div>
      </div>
    </div>`;
  });
  userItem.innerHTML = rawHTML;
  chatUserList.appendChild(userItem);
});

// 如果是公開聊天室，會向後端要求 'join' 'public'這個房間
if (window.location.pathname === '/chat/public') {
  socket.emit('join', 'public');
}

if (chatForm !== null) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.value) {
      // 在公開聊天室，發送訊息
      socket.emit('sendMessage', {
        identifier: 'public',
        message   : chatInput.value,
      });
      chatInput.value = '';
    }
  });
}

// 傳送使用者聊天訊息
socket.on('newMessage', (message) => {
  const item = document.createElement('li');
  item.innerHTML = `
    <div class="d-flex align-items-end">
      <img id="chat-user-avatar" class="rounded-circle mr-2" src="${message.sender.avatar}" alt="">
        <div id="chat-bubble" class="item-desc pt-2 pb-1">
          ${message.message}
        </div>
       </div>
      <div id="chat-createdAt" class="ml-5">${message.createdAt}</div>
    </div>
  `;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
