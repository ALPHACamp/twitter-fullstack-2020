const socket = io();
const messages = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatUserList = document.querySelector('#chat-user-list');
let myUserId;

// Temporary only, demonstrate the login connection workability
socket.on('connect', () => {
  console.log('socket.id', socket.id);
});

// 使用者本人登入 前端收到本人id。在後續動作可利用 id 判斷是否為本人
socket.on('me', (id) => {
  myUserId = id;
  console.log('myUserId', myUserId);
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
  chatUserList.innerHTML = rawHTML;
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
  // 如果傳送訊息是本人，會用這個對話格式 右側顯示+橘色泡泡 chat-bubble 加上 style=color:orange 僅做測試用
  if (message.sender.id === myUserId) {
    item.innerHTML = `
    <div class="d-flex align-items-end">
      <img id="chat-user-avatar" class="rounded-circle mr-2" src="${message.sender.avatar}" alt="">
        <div id="chat-bubble" class="item-desc pt-2 pb-1" style="color: orange">
          ${message.message}
        </div>
       </div>
      <div id="chat-createdAt" class="ml-5">${message.createdAt}</div>
    </div>
  `;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
  // 如果傳送訊息是對方，會出現這個對話格式 左側顯示＋灰色泡
  else {
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
  }
});

// 使用者離線，顯示離線訊息，更新在線者人數
socket.on('userLeft', (data) => {
  // 在線者人數
  console.log(data.usersInRoom);
  // 顯示誰離開的離線訊息
  const item = document.createElement('li');
  item.innerHTML = ` ${data.user.name} 離線 `;
  // item.setAttribute('class','mx-auto');
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
