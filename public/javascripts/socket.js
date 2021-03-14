const socket = io();
const messages = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatPMInput = document.querySelector('#chat-pm-input');
const publicChatUserList = document.querySelector('#public-chat-user-list');
const privateChatUserList = document.querySelector('#private-message-list');
const privateMessageCount = document.querySelector('#message-notify-count');
const subcribeNotification = document.querySelector('#bell-notify-id');

let myUserId;
const generateUserOnlineMessage = (userObj) => `<li class="user-status-message text-center"> <span class="w-auto py-1 px-2 badge-pill">${userObj.user.name} 上線</span> </li>`;
const generateUserOfflineMessage = (userObj) => `<li class="user-status-message text-center"> <span class="w-auto py-1 px-2 badge-pill">${userObj.user.name} 離線</span> </li>`;
const generateMessage = (message) => {
  const sender = (message.Sender !== undefined) ? message.Sender : message.sender;
  let messageHTML = '';
  if (sender.id === myUserId) {
    messageHTML = `
    <li class="message-item-self d-flex justify-content-end">
      <div class="">
        <div class="chat-bubble-self item-desc px-3 py-2">${message.message}</div>
        <div class="chat-createdAt text-lightgrey"><p class="text-end">${message.createdAt}</p></div>
      </div>
    </li>`;
    return messageHTML;
  }
  messageHTML = `
    <li class="message-item-other">
      <div class="d-flex align-items-end">
        <img class="chat-user-avatar rounded-circle mr-2" src="${sender.avatar}" alt="">
        <div class="chat-bubble-other item-desc px-3 py-2">${message.message}</div>
      </div>
      <div class="chat-createdAt ml-5 text-lightgrey">${message.createdAt}</div>
    </li>`;
  return messageHTML;
};
const generateUserList = (users) => {
  // // 更新 user count 外面有個函式 updateUserCount 看以後要不要放進來
  // document.querySelector('#chatroom-user-count').innerHTML = users.length;

  let usersHtml = '';
  users.forEach((user) => {
    usersHtml += `
    <div class="d-flex flex-row no-wrap w-100 p-3 pointer tweet-gray">
      <a class="profile-img mr-3 d-flex flex-row no-wrap w-100 text-dark text-decoration-none" href="/chat/private/${user.id}"> 
        <img class="img-fluid rounded-circle mr-2" src="${user.avatar}" alt=""> 
        <div class="item-header d-flex d-column no-wrap justify-content-start align-items-center">
          <div class="name w-100 pr-2">
            ${user.name}
          </div>
          <div class="item-username">
              <span class="username text-lightgrey">@${user.account}</span>
          </div>
        </div>
      </a>
    </div>`;
  });
  return usersHtml;
};
const updateUserCount = (users) => {
  if (document.querySelector('#chatroom-user-count') !== null) {
    document.querySelector('#chatroom-user-count').innerHTML = users.length;
  }
};

// Temporary only, demonstrate the login connection workability
socket.on('connect', () => {
  socket.emit('getAndNotifyAllUnread');
  socket.emit('checkUnreadNotification');
});

// 使用者本人登入 前端收到本人id。在後續動作可利用 id 判斷是否為本人
socket.on('me', (id) => {
  myUserId = id;
});

// 使用者已上線, 會同時推送上線的使用者，以及這個使用者加入的房間裡的用戶 array
socket.on('userJoined', (userObj) => {
  // 使用者上線提示
  const userOnlineMessage = generateUserOnlineMessage(userObj);

  // 更新訊息列表
  if (document.querySelectorAll('#chat-messages .message-item-self').length > 0) {
    // 已經在聊天室裡面且有有過去訊息
    if (String(userObj.roomType) !== 'private') {
      messages.innerHTML += `${generateUserOnlineMessage(userObj)}`;
    }
  } else if (userObj.previousMessages !== undefined) {
    // 新的使用者
    // 建立過去訊息列表
    let previousMessagesHtml = '';
    userObj.previousMessages.forEach((message) => {
      previousMessagesHtml += generateMessage(message);
    });
    if (String(userObj.roomType) !== 'private') {
      messages.innerHTML = `${previousMessagesHtml}${userOnlineMessage}`;
    } else {
      messages.innerHTML = `${previousMessagesHtml}`;
    }
  } else {
    // 已經在聊天室裡面但沒有過去訊息
    if (String(userObj.roomType) !== 'private') {
      messages.innerHTML += `${generateUserOnlineMessage(userObj)}`;
    }
  }
  // 如果是在public chatroom
  if (publicChatUserList !== null) {
    publicChatUserList.innerHTML = '';
    updateUserCount(userObj.usersInRoom);
    publicChatUserList.innerHTML += generateUserList(userObj.usersInRoom);
  }
  window.scrollTo(0, document.body.scrollHeight);
  messages.scrollIntoView(false);
});

// 如果是公開聊天室，會向後端要求 'join' 'public'這個房間
if (window.location.pathname === '/chat/public') {
  socket.emit('join', 'public');
} else if (window.location.pathname.includes('/chat/private')) {
  socket.emit('join', 'private');
}

if (chatForm !== null) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput) {
      // 在公開聊天室，發送訊息
      socket.emit('sendMessage', {
        identifier: 'public',
        message   : chatInput.value,
      });
      chatInput.value = '';
    }
    if (chatPMInput) {
      // 在私人聊天室，發送訊息
      socket.emit('sendMessage', {
        identifier: 'private',
        receiverId: chatPMInput.dataset.receiverId,
        message   : chatPMInput.value,
      });
      chatPMInput.value = '';
    }
  });
}

// 傳送使用者聊天訊息
socket.on('newMessage', (message) => {
  console.log('message', message);
  messages.innerHTML += generateMessage(message);
  messages.scrollIntoView(false);
});

// 使用者離線，顯示離線訊息，更新在線者人數
socket.on('userLeft', (data) => {
  // 更新在線者人數和在線使用者列表
  updateUserCount(data.usersInRoom);
  publicChatUserList.innerHTML = generateUserList(data.usersInRoom);

  // 顯示誰離開的離線訊息
  if (String(data.roomType) !== 'private') {
    messages.innerHTML += (`${generateUserOfflineMessage(data)}`);
  }
  messages.scrollIntoView(false);
});

// 顯示未讀訊息
socket.on('unreadMessageNotification', (count) => {
  privateMessageCount.innerText = count.messages.length;
});

// 顯示未讀通知
socket.on('currentUnreadNotification', (count) => {
  subcribeNotification.innerText = count;
});
