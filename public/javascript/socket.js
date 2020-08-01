$(function () {
  const socket = io()
  const chatForm = document.querySelector('#chat-form')
  const input = document.querySelector('#input')
  const chatContent = document.querySelector('.chat-main')
  const typing = document.querySelector('.typing')
  const onlineUserColumn = document.querySelector('.online-user-column')


  chatForm.addEventListener('submit', event => {
    event.preventDefault()
    if (input.value.length === 0) { return false }
    // socket.emit('chat', { message: input.value })
    socket.emit('chat', input.value)
    socket.emit('typing', { isExist: false })
    input.value = ''
    return false
  })

  // message from server
  socket.on('message', data => {
    output.innerHTML += `<div class="broadcast"> <div><span>${data.message}</span></div></div>`
  })

  //在線使用者
  socket.on('onlineUser', data => {
    let allItem = ``
    for (let i = 0; i < data.length; i++) {

      allItem +=
        `
      <div class="online-user-item ">
          <div class="online-user-avatar"
            style="background: url(${data[i].useravatar}),#C4C4C4; background-position:center;background-size:cover;">
          </div>
          <div class="online-user-name">${data[i].username} <span>@${data[i].useraccount}</span></div>
        </div>
      `
    }
    onlineUserColumn.innerHTML = allItem
  })

  // message from user
  socket.on('chat', data => {
    output.innerHTML += `
      <div class="chat-message">
        <div class="chat-avatar" style="background: url(),#C4C4C4; background-position:center;background-size:cover;">
          </div>
        <div class="column">
          <div class="chat-text"><span>${data.name} :</span>${data.message}</div>
          <div class="chat-time">${data.time}</div>
        </div>
      </div>
    `

    chatContent.scrollTop = chatContent.scrollHeight
  })

  //監聽使用者輸入動態
  input.addEventListener('input', (e) => {
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



})
