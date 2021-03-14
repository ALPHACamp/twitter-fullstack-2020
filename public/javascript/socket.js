const socket = io()
const chatForm = document.querySelector('#chat-form')
const textarea = document.querySelector('#textarea')
const online = document.querySelector('#online')
const typing = document.querySelector('#is-typing')
const chatContainer = document.querySelector('#chat-container')
const onlineUsersList = document.querySelector('#online-user-list')
const sendBtn = document.querySelector('#send')
const output = document.querySelector('#output')
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
// 系統發出誰加入誰退出的訊息
socket.on('message', data => {
  output.innerHTML += `<div><span>${data}</span></div>`
  chatContainer.scrollTop = chatContainer.scrollHeight
})

// 線上使用者
socket.on('onlineUsers', data => {
  onlineUsers.push(data)
  let userList = ''
  data.forEach(user => {
    userList += `
           <li class="list-group-item">
              <a href="/users/${user.id}/tweets">
                <div class="row">
                  <div class="col-2 mr-4">
                    <img src="${user.avatar}" alt="user avatar"
                      class="user-avatar">
                  </div>
                  <div class="col-8 d-flex align-items-center">
                    <span class="chat-user-name"><strong>${user.name}</strong></span>
                    <span class="chat-user-account">@${user.account}</span>
                  </div>
                </div>
              </a>
            </li>
            `
  })
  onlineUsersList.innerHTML = userList
})
