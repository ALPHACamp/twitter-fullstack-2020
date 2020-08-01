$(function () {
  const socket = io()
  const chatForm = document.querySelector('#chat-form')
  const feedback = document.querySelector('#feedback')
  const input = document.querySelector('#input')
  const output = document.querySelector('#output')
  const chatName = document.querySelector('.chat-name').textContent
  const chatAvatar = document.querySelector('.chat-avatar')

  chatForm.addEventListener('submit', event => {
    event.preventDefault()
    socket.emit('chat', input.value)
    input.value = ''
    return false
  })

  input.addEventListener('input', (e) => {
    //若有值就傳名字，
    if (e.target.value) {
      socket.emit('typing', chatName)
    } else {
      socket.emit('typing')
    }
  })

  // 監聽內容傳進 html 
  socket.on('chat', data => {
    output.innerHTML += '<div>' + data + '</div>'
  })
  socket.on('typing', data => {
    if (data) {
      feedback.innerHTML = `${data}正在輸入中`
    } else {
      feedback.innerHTML = ``
    }
  })
})


