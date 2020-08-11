$(function () {
  const socket = io()
  const mailForm = document.querySelector('#mail-form')
  const input = document.querySelector('#input')
  const mailContent = document.querySelector('.mail-main')
  const output = document.querySelector('#output-mail')
  const receiverId = Number(location.pathname.slice(9, 20))

  socket.emit('privateMessage', receiverId)

  // emit input message to socket
  mailForm.addEventListener('submit', event => {
    event.preventDefault()
    if (input.value.length === 0) { return false }
    const message = input.value
    console.log(input)
    socket.emit('sendPrvate', { message, receiverId })
    input.value = ''
    return false
  })

  socket.on('privateHistory', data => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].currentUser === true) {
        output.innerHTML += `
        <div class="self-message">
            <div class="self-text">${data[i].message}</div>
            <div class="chat-time">${data[i].time}</div>
          </div>
        `
      }
      else {
        output.innerHTML += `
          <div class="chat-message">
            <div class="chat-avatar" style="background: url(${data[i].avatar}),#C4C4C4; background-position:center;background-size:cover;">
              </div>
            <div class="column">
              <div class="chat-text"><span>${data[i].name} :</span>${data[i].message}</div>
              <div class="chat-time">${data[i].time}</div>
            </div>
          </div>
        `
      }
    }
    console.log(data)

    chatContent.scrollTop = chatContent.scrollHeight
  })

  socket.on('sendPrivate', data => {
    if (data.currentUser === true) {
      output.innerHTML += `
      <div class="self-message">
          <div class="self-text">${data.message}</div>
          <div class="chat-time">${data.time}</div>
        </div>
      `
    }
    else {
      output.innerHTML += `
        <div class="chat-message">
          <div class="chat-avatar" style="background: url(${data.avatar}),#C4C4C4; background-position:center;background-size:cover;">
            </div>
          <div class="column">
            <div class="chat-text"><span>${data.name} :</span>${data.message}</div>
            <div class="chat-time">${data.time}</div>
          </div>
        </div>
      `
    }

    mailContent.scrollTop = mailContent.scrollHeight
  })

})
