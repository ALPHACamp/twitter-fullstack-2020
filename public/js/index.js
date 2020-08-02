const socket = io({
  path:'/chatroom'
})
const chattingMsg = document.querySelector('#chattingMsg')
const chatting = document.querySelector('#chatting')
const chatForm = document.querySelector('#chatForm')
const message = document.querySelector('#message')
const chatLink = document.querySelector('#chatLink')
const id = document.querySelector('#id')
const name = document.querySelector('#name')
const account = document.querySelector('#account')
const avatar = document.querySelector('#avatar')
let userArea = document.querySelector('#allUser')
let onlineUser = document.querySelector('#onlineUser')


let usersInChatroom = []
let chatroomMsg = []
// let self

//when users online 重新將user arr 插入ul
//1 從哪邊監聽進入聊天室的事件？
//2 如何判斷離開聊天室

//when users offline 重新將user arr 插入ul

//when get message 重新將message 插入
//msg emit {userId, name, avatar, msg, time}

//連線後將使用者資料傳到app.js
socket.emit('user-online', {
  UserId: id.value,
  name: name.value,
  avatar: avatar.value,
  account: account.value
});

chatForm.addEventListener('submit', (e) => {
e.preventDefault()
let msg = {
  UserId: id.value,
  name: name.value,
  avatar: avatar.value,
  account: account.value,
  time: new Date(),
  message: message.value
}
socket.emit('chat_msg', msg)
message.value = ''
message.focus()
})

socket.on('disconnect', (users) => {

})

socket.on('renderMsg', (msg) => {
  
  if (msg.UserId === id.value) {
    chattingMsg.appendChild(selfMsg(msg));
  } else {
    chattingMsg.appendChild(getMsg(msg));
  }
});
socket.on('user-online', (user) => {
  chattingMsg.appendChild(userOnline(user, 'online'));
});
socket.on('user-offline', (user) => {
  chattingMsg.appendChild(userOnline(user, 'offline'));
});
socket.on('renderUser', (users) => {
  onlineUser.innerHTML = ''
  users.forEach(e => {
    onlineUser.appendChild(renderUser(e))
  });
});
socket.on('userCount', (count) => {
  document.querySelector('#count').innerText = `
    上線使用者 (${count})`;
});


function userOnline(user, connectStatus) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  li.classList.add('d-flex', 'justify-content-center', 'm-2');
  span.classList.add('online');
  if (connectStatus === 'online') {
    span.innerText = `${user.name} 上線了`;
  } else if (connectStatus === 'offline'){
    span.innerText = `${user.name} 離開了`;
  }
  li.appendChild(span);
  return li;
}

//msg emit {userId, name, avatar, msg, time}
function getMsg(msg) {
  const li = document.createElement('li');
  const avatar = document.createElement('img');
  const div = document.createElement('div');
  const p = document.createElement('p');
  const span = document.createElement('span');

  li.classList.add('d-flex');
  avatar.classList.add('rounded-circle', 'm-2');
  div.classList.add('d-flex', 'flex-column');
  p.classList.add('otherMsg', 'm-0');

  span.innerText = msg.time;
  p.innerText = msg.message;
  div.appendChild(p);
  div.appendChild(span);
  avatar.src = `${msg.avatar}`;
  avatar.width = '60';
  avatar.height = '60';
  li.appendChild(avatar);
  li.appendChild(div);

  return li;
}

function userOffline() {}

function selfMsg(msg) {
  const li = document.createElement('li');
  const p = document.createElement('p');
  const span = document.createElement('span');

  li.classList.add('d-flex', 'flex-column', 'align-items-end');
  p.classList.add('selfMsg', 'm-0');
  p.innerText = msg.message;
  span.innerText = msg.time;
  li.appendChild(p);
  li.appendChild(span);
  return li;
}

function renderUser(user) {
  const li = document.createElement('li');
  const avatar = document.createElement('img');
  const div = document.createElement('div');
  const h5 = document.createElement('h5');
  const span = document.createElement('span');

  li.classList.add('list-group-item', 'm-1');
  avatar.classList.add('rounded-circle', 'm-2');
  div.classList.add(
    'd-flex',
    'flex-column',
    'align-items-center',
    'flex-lg-row',
    'align-items-lg-center'
  );
  h5.classList.add('mr-lg-2', 'm-0');
  span.classList.add('text-secondary', 'm-0');

  avatar.src = `${user.avatar}`;
  avatar.width = '60';
  avatar.height = '60';
  h5.innerText = user.name;
  span.innerText = `@${user.account}`;

  div.appendChild(avatar);
  div.appendChild(h5);
  div.appendChild(span);
  li.appendChild(div);
  return li;
}
