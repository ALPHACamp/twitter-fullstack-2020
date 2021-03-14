const socket = io()
const chatForm = document.querySelector('#chat-form')
const textarea = document.querySelector('#textarea')
const online = document.querySelector('#online')
const typing = document.querySelector('#is-typing')
const chatContainer = document.querySelector('#chat-container')
const onlineUsersList = document.querySelector('.online-users-list')
const sendBtn = document.querySelector('@send')
const onlineUsers = []

// 線上人數
socket.on('online', onlineCount => {
  online.innerText = onlineCount
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
