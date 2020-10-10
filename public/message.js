var socket = io()

const chatForm = document.getElementById('chat-form')

chatForm.addEventListener('submit', e => {
  e.preventDefault()

  const msg = e.target.elements.message.value
  
  socket.emit('chatMessage', msg)
})
socket.on('chatMessage', (msg) => {
  console.log(msg)
  appendData(msg)
});

function appendData(message) {
  const el = document.getElementById('messages')
  el.appendChild((document.createElement('div'))).innerHTML = `${message}`

}