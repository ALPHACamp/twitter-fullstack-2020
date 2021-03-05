chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

const socket = io()

socket.on('message', message => {
  console.log(message)
  getMessage(message)

  
})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let msg = e.target.elements.msg

  socket.emit('chatMessage', msg.value)

  msg.value = ''
  msg.focus()

})

// 把訊息帶回聊天室窗
function getMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p> ${message} </p>`
  chatMessages.appendChild(div)
}