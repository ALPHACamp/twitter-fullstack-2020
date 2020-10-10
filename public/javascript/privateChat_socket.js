(function () {

  const chatList = document.querySelector('#chat-list')
  const chatroom = document.querySelector('#chat-room')
  const chatForm = document.querySelector('#send-form')
  const chatMessages = document.querySelector('.messages')
  const relativeId = chatroom.dataset.relative
  const userId = chatList.dataset.id
  const userAvatar = chatList.dataset.avatar

  if (userId !== relativeId) {
    socket.emit('start private chat', userId, relativeId)
  }

  socket.on('receive private message', msgInfo => {
    console.log('we received', msgInfo)
    chatMessages.innerHTML += `
    <div class='d-flex flex-row justify-content-start my-2'>
        <div class="d-flex align-items-center">
          <img class="message-image rounded-circle mr-2"
            src="${msgInfo.avatar}" alt="">
          <div class="received-message d-flex flex-column align-items-start">
            <div class="message">${msgInfo.msg}</div>
            <small class="received-time text-muted">${msgInfo.createdTime}</small>
          </div>
        </div>
      </div>
    `
  })
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const msg = document.querySelector('#msg').value
    if (msg.trim()) {
      const createdTime = moment().calendar()
      const msgInfo = { msg, avatar: userAvatar, userId, createdTime }
      socket.emit('chat private message', msgInfo)
      chatMessages.innerHTML += `
      <div class='d-flex flex-row justify-content-end my-2'>
          <div class="d-flex align-items-center">
            <div class="send-message d-flex flex-column align-items-end ">
              <div class="message">${msg}</div>
              <small class="send-time text-muted">${createdTime}</small>
            </div>
          </div>
        </div>
      `
    }
    document.querySelector('#msg').value = ''
  })
})()
