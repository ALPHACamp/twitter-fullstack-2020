var socket = io()

const chatForm = document.getElementById('chat-form')

chatForm.addEventListener('submit', e => {
  e.preventDefault()

  const msg = e.target.elements.message.value
  
  socket.emit('chatMessage', msg)
})

socket.on('chatMessage', (data) => {
  appendData(data)
});

function appendData(data) {
  const el = document.getElementById('messages')
  const htmlString = `<img src="${data.avatar}" class="user-avatar"> ${data.username}: ${data.message}`
  el.appendChild((document.createElement('div'))).innerHTML = htmlString
}
