$(function () {
  const socket = io()
  const chatForm = document.querySelector('#chat-form')
  const input = document.querySelector('#input')
  const chatContent = document.querySelector('.chat-main')
  const typing = document.querySelector('.typing')

  chatForm.addEventListener('submit', event => {
    event.preventDefault()
    // socket.emit('chat', { message: input.value })
    socket.emit('chat', input.value)
    socket.emit('typing', { isExist: false })
    input.value = ''
    return false
  })

  // message from server
  socket.on('message', message => {
    output.innerHTML += `<div class="broadcast">
    <div><span>${message}</span></div>
    </div>
    `
  })

  // message from user
  socket.on('chat', data => {
    output.innerHTML += ` <div class="chat-message">
          <div class="chat-avatar"
            style="background: url({{user.avatar}}),#C4C4C4; background-position:center;background-size:cover;"></div>
          <span class="name">${data.name}</span>
          <div class="column">
            <div class="chat-text">${data.message}</div>
            <div class="chat-time">${data.time}</div>
          </div>
        </div>`

    // output.innerHTML += '<div>' + data.name + ' : ' + data.message + '</div>'
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
      typing.innerHTML = `${data.name}正在輸入`
    } else {
      typing.innerHTML = ''
    }
  })

})
