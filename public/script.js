const socket = io('http://localhost:3000')
const message = document.getElementById('message')
const name = document.getElementById('name')
const avatar = document.getElementById('avatar')
const btn = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const chatMessages = document.querySelector('.chat-messages')

//提示訊息
socket.on('message', message => {
  outPutmessage(message)  //output到DOM上
  //scrolldown
  chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('chat-message', data => {
  console.log("hye", data)
})


//chatroomhandlebars傳來的資訊
btn.addEventListener('click', e => {
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
  socket.emit('typing', name.value);
})

//Listen for events
socket.on('chat-message', (data) => {
  output.innerHTML += '<P><strong>' + data.name + ': </strong>' + data.message + '</p>'
})

socket.on('typing', data => {
  feedback.innerHTML = ' <p><em>' + data + ' is typing a message......</em></p>'
})

socket.on('online', onlineCount => {
  online.innerText = onlineCount
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


// socket.on('send-chat-message', message => {
//   console.log(message)
// })
