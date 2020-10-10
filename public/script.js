const socket = io('http://localhost:3000')
const message = document.getElementById('message')
const handle = document.getElementById('handle')
const btn = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')

socket.on('message', message => {
  console.log(message)
})



socket.on('chat-message', data => {
  console.log(data)
})

//Emit events

btn.addEventListener('click', e => {
  console.log('成功')
  e.preventDefault()
  socket.emit('chat-message',
    {
      message: message.value,
      // handle: handle.value
    }
  )
  messageInput.value = ''
});

message.addEventListener('keypress', () => {
  socket.emit('typing', handle.value);

})

//Listen for events
socket.on('chat-message', (data) => {
  output.innerHTML += '<P><strong>' + data.handle + ': </strong>' + data.message + '</p>'
})

socket.on('typing', data => {
  feedback.innerHTML = ' <p><em>' + data + 'is typing a message......</em></p>'
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})


console.log('a user connected')
socket.emit('chat-message', 'helloworld')
socket.on('send-chat-message', message => {
  console.log(message)
})