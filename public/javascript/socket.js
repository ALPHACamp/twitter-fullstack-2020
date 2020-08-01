$(function () {
  const socket = io()
  const chatForm = document.querySelector('#chat-form')
  const feedback = document.querySelector('#feedback')
  const input = document.querySelector('#input')
  const output = document.querySelector('#output')

  chatForm.addEventListener('submit', event => {
    event.preventDefault()
    socket.emit('chat', input.value)
    input.value = ''
    return false
  })

  input.addEventListener('keypress', () => {
    socket.emit('typing', input.value)
  })

  // 監聽內容傳進 html 
  socket.on('chat', data => {
    output.innerHTML += '<div>' + data + '</div>'
  })
  socket.on('typing', data => {
    feedback.innerHTML = data
  })
})


