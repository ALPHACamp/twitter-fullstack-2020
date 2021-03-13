const socket = io();
const messages = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatUserList = document.querySelector('#chat-user-list');
let myUserId;
const generateUserOnlineMessage = (userObj) => `<li> ${userObj.user.name} 上線 </li>`;
const generateUserOfflineMessage = (userObj) => `<li> ${userObj.user.name} 離線 </li>`;
const generateMessage = (message) => {
  const sender = (message.Sender !== undefined) ? message.Sender : message.sender;
  let messageHTML = '';
  if (sender.id === myUserId) {
    messageHTML = `
    <li class="message-item">
      <div class="d-flex align-items-end">
        <img id="chat-user-avatar" class="rounded-circle mr-2" src="${sender.avatar}" alt="">
        <div id="chat-bubble" class="item-desc pt-2 pb-1" style="color: orange">
          ${message.message}
        </div>
        <div id="chat-createdAt" class="ml-5">${message.createdAt}</div>
      </div>
    </li>`;
    return messageHTML;
  }
  messageHTML = `
  <li class="message-item">
    <div class="d-flex align-items-end">
      <img id="chat-user-avatar" class="rounded-circle mr-2" src="${sender.avatar}" alt="">
      <div id="chat-bubble" class="item-desc pt-2 pb-1">${message.message}</div>
      <div id="chat-createdAt" class="ml-5">${message.createdAt}</div>
    </div>
  </li>`;
  return messageHTML;
};
const generateUserList = (users) => {
  // 更新 user count
  document.querySelector('#chatroom-user-count').innerHTML = users.length;

  let usersHtml = '';
  users.forEach((user) => {
    usersHtml += `
    <div class="d-flex flex-row no-wrap align-items-star w-100 p-3">
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
  return usersHtml;
};
const updateUserList = (users) => {
  document.querySelector('#chatroom-user-count').innerHTML = users.length;
};

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
  // 使用者上線提示
  const userOnlineMessage = generateUserOnlineMessage(userObj);
  // 更新訊息列表
  if (document.querySelectorAll('#chat-messages .message-item').length > 0) {
    // 已經在聊天室裡面且有有過去訊息
    messages.innerHTML = (`${messages.innerHTML}${generateUserOnlineMessage(userObj)}`);
  } else {
    // 新的使用者
    // 建立過去訊息列表
    let previousMessagesHtml = '';
    userObj.previousMessages.forEach((message) => {
      previousMessagesHtml += generateMessage(message);
    });
    messages.innerHTML = `${previousMessagesHtml}${userOnlineMessage}`;
  }
  updateUserList(userObj.usersInRoom);
  window.scrollTo(0, document.body.scrollHeight);

  chatUserList.innerHTML += generateUserList(userObj.usersInRoom);
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
  messages.innerHTML += generateMessage(message);
});

// 使用者離線，顯示離線訊息，更新在線者人數
socket.on('userLeft', (data) => {
  // 更新在線者人數和在線使用者列表
  console.log(data.usersInRoom);
  updateUserList(data.usersInRoom);
  // 顯示誰離開的離線訊息
  messages.innerHTML = (`${messages.innerHTML}${generateUserOfflineMessage(userObj)}`);
});
