const user = require("../models/user")

const socket = io('http://localhost:3000')
const message = document.getElementById('message')
const name = document.getElementById('name')
const avatar = document.getElementById('avatar')
const btn = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const chatMessages = document.querySelector('.chat-messages')

//get username from URL
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username })

//提示訊息
socket.on('message', message => {
  console.log(message)
  outPutmessage(message)

  //scrolldown
  chatMessages.scrollTop = chatMessages.scrollHeight
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


//Output message to DOM
function outPutmessage(message) {
  const div = document.createElement('div')
  div.classList.add('message');
  div.innerHTML = `
<p class="meta">${message.username}</span></p>
<p class="meta">${message.text}</span></p>
<p class="meta">${message.time}</span></p>
  `;
  document.querySelector('.chat-messages').appendChild(div)
}

console.log('a user connected')
socket.emit('chat-message', 'helloworld')
socket.on('send-chat-message', message => {
  console.log(message)
})