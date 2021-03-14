const socket = io()
const chatForm = document.querySelector('#chat-form')
const textarea = document.querySelector('#textarea')
const online = document.querySelector('#online')
const typing = document.querySelector('#is-typing')
const chatContainer = document.querySelector('#chat-container')
const onlineUsersList = document.querySelector('.online-users-list')
const sendBtn = document.querySelector('#send')
const messageZone = document.querySelector('.message-zone')
const onlineUsers = []

//處理時間
const date = new Date()
let currentTime = date.getMinutes() < 10 ? `${date.getHours()}:0${date.getMinutes()}` : `${date.getHours()}:${date.getMinutes()}`

// 線上人數
socket.on('online', onlineCount => {
  online.innerText = onlineCount
})

// 通知
socket.on('message', message => {
  console.log(message)
  messageZone.innerHTML += `
    <li class="system-info">
      <span>${message.text}</span>
    </li>
  `
})

// 監聽是否有人在打字
textarea.addEventListener('input', e => {
  if (e.target.value) {
    socket.emit('typing', { isExist: true })
  } else {
    socket.emit('typing', { isExist: false })
  }
})
socket.on('typing', data => {
  if (data.isExist) {
    typing.innerHTML = `${data.name} is typing...`
  } else {
    typing.innerHTML = ''
  }
})

//client發出訊息
sendBtn.addEventListener('click', e => {
  const data = {
    text: textarea.value,
    userId: 5
  }
  socket.emit('chat', data)
})

//client接收其他client發出的訊息
socket.on('chat', data => {
  if (data.userId === 5) {
    messageZone.innerHTML += `
    <li class="list-group-item message-line">
      <div class="right-message-box">
        <p>${data.text}</p>
      </div>
      <small class="right-time-box">${currentTime}</small>
    </li>
  `
  } else {
    messageZone.innerHTML += `
    <li class="list-group-item message-line">
      <div class="d-flex">
        <div style="width: 55px; height: 55px;">
          <img src="${onlineUsers.avatar}" alt="user avatar"
                  class="message-user-avatar">
        </div>
        <div class="left-message-box">
          <p>${data.text}</p>
        </div>
      </div>
      <small class="left-time-box">${currentTime}</small>
    </li>
  `
  }
})