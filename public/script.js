const socket = io('http://localhost:3000')
const message = document.getElementById('message')
const name = document.getElementById('name')
const avatar = document.getElementById('avatar')
const btn = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const online = document.getElementById('online')

// 當觸發連線時, 傳送 userOnline 事件給伺服器
socket.on("connect", () => {
  socket.emit("userOnline")
})

//提示訊息
socket.on('message', message => {
  console.log(message)
})

socket.on('chat-message', data => {
  console.log("hye", data)
})


//chatroomhandlebars傳來的資訊
btn.addEventListener('click', e => {
  console.log('成功')
  e.preventDefault()
  socket.emit('chat-message',
    {
      message: message.value,
      name: name.value,
      avatar: avatar.value
    }

  )
  messageInput.value = ''
});

message.addEventListener('keypress', () => {
  socket.emit('typing', handle);
})

//Listen for events
socket.on('chat-message', (data) => {
  output.innerHTML += '<P><strong>' + data.name + ': </strong>' + data.message + '</p>'
})

socket.on('typing', data => {
  feedback.innerHTML = ' <p><em>' + data.name + 'is typing a message......</em></p>'
})

socket.on('online', amount => {
  online.innerText = amount
})

// messageForm.addEventListener('submit', e => {
//   e.preventDefault()
//   const message = messageInput.value
//   socket.emit('send-chat-message', message)
//   messageInput.value = ''
// })


console.log('a user connected')
socket.emit('chat-message', 'helloworld')
socket.on('send-chat-message', message => {
  console.log(message)
})