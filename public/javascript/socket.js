$(function () {
  const socket = io()
  const chatForm = document.querySelector('#chat-form')
  const broadcast = document.querySelector('#broadcast')
  const input = document.querySelector('#input')
  const welcome = document.querySelector('.welcome')

  chatForm.addEventListener('submit', event => {
    event.preventDefault()
    socket.emit('chat', input.value)
    socket.emit('typing')
    input.value = ''
    return false
  })

  // message from server
  socket.on('message', message => {
    welcome.innerHTML += '<div>' + message + '</div>'
  })

  // message from user
  socket.on('chat', data => {
    output.innerHTML += '<div>' + data.username + ' : ' + data.message + '</div>'
  })

  // //監聽使用者輸入動態
  // input.addEventListener('input', (e) => {
  //   //若有值就傳名字，
  //   if (e.target.value) {
  //     socket.emit('typing', chatName)
  //   } else {
  //     socket.emit('typing')
  //   }
  // })
  // socket.on('typing', data => {
  //   if (data) {
  //     broadcast.innerHTML = `${data}正在輸入中`
  //   } else {
  //     broadcast.innerHTML = ``
  //   }
  // })

})
