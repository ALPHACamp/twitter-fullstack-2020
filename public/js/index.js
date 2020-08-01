const socket = io()
const chattingMsg = document.querySelector('#chattingMsg')
const chatting = document.querySelector('#chatting')
const chatForm = document.querySelector('#chatForm')
const message = document.querySelector('#message')
const chatLink = document.querySelector('#chatLink')

let usersInChatroom = []
let chatroomMsg = []
let self

//when users online 重新將user arr 插入ul
//1 從哪邊監聽進入聊天室的事件？
//2 如何判斷離開聊天室


//when users offline 重新將user arr 插入ul

//when get message 重新將message 插入
//msg emit {userId, name, avatar, msg, time}

chatForm.addEventListener('click', (e) => {
  socket.emit('user-online')
})

chatForm.addEventListener('submit', (e) => {
e.preventDefault()
let msg = {
  time: new Date(),
  message: message.value
}
const text = selfMsg(msg)
chatroomMsg.appendChild(text)
socket.broadcast.emit('chat_msg', msg)
message.value = ''
})

let = text = ''

socket.on('chat_msg', (msg) => {
  chatroomMsg.push(msg)
  chattingMsg.appendChild(getMsg(msg))
})

socket.on('user-online', (newUser) => {
  const online = userOnline(usersInChatroom, newUser)
  if(online !== '') {
    chattingMsg.appendChild(userOnline(usersInChatroom, newUser))
  }
})

function userOnline(arr, user) {
  if(arr.map(r => r.name).includes(user.name)) return ''
  arr.push(user)
  const li = document.createElement('li')
  const span = document.createElement('span')
  li.classList.add('d-flex', 'justify-content-center', 'm-2')
  span.classList.add('online')
  span.innerText = `${user.name} 上線了`
  li.appendChild(span)

  return li
}

//msg emit {userId, name, avatar, msg, time}
function getMsg(msg, arr) {
  const li = document.createElement('li')
  const avatar = document.createElement('img')
  const div = document.createElement('div')
  const p = document.createElement('p')
  const span = document.createElement('span')

  li.classList.add('d-flex')
  avatar.classList.add('rounded-circle', 'm-2')
  div.classList.add('d-flex', 'flex-column')
  p.classList.add('otherMsg', 'm-0')

  span.innerText = msg.time
  p.innerText = msg.message
  div.appendChild(p)
  div.appendChild(span)
  avatar.src = `${msg.avatar}`
  avatar.width = '60'
  avatar.height = '60'
  li.appendChild(avatar)
  li.appendChild(div)

  return li
}

function userOffline() {

}

function selfMsg (msg) {
  const li = document.createElement('li')
  const p = document.createElement('p')
  const span = document.createElement('span')

  li.classList.add('d-flex', 'flex-column', 'align-items-end')
  p.classList.add('selfMsg', 'm-0')
  p.innerText = msg.message
  span.innerText = msg.time
  li.appendChild(p)
  li.appendChild(span)
  return li
}


