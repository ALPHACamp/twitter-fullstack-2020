const socket = io('http://localhost:3000')
const message = document.getElementById('message')
const name = document.getElementById('name')
const avatar = document.getElementById('avatar')
const btn = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')
const chatMessages = document.querySelector('.chat-messages')
const onlineUserContent = document.getElementById('online-user-content')
let onlineUsers = []


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
  // output.innerHTML += '<P><strong>' + data.name + ': </strong>' + data.message + '</p>'



  if (data.name === name.value) {
    output.innerHTML += `<div class='d-flex flex-row justify-content-end my-2'>
        <div class="d-flex align-items-center" >
          <div class="send-message d-flex flex-column align-items-end " style="color: #FF0000">
            <div class="receiver-message">${data.message}</div>
            <small class="send-time text-muted">上午 06:00</small>
          </div>
          <img class="message-image rounded-circle ml-2" src="${data.avatar}" alt="" style="width:60px">
        </div>
      </div>`
  } else {

    output.innerHTML += `<div class='d-flex flex-row justify-content-start my-2'>
        <div class="d-flex align-items-center" >
        <img class="message-image rounded-circle ml-2" src="${data.avatar}" alt="" style="width:60px">
          <div class="send-message d-flex flex-column align-items-end " style="color: #FF0000">
            <div class="sender-message ">${data.message}</div>
            <small class="send-time text-muted">上午 06:00</small>
          </div>
        </div>
      </div>`

  }

})

//when someone is typing
socket.on('typing', data => {
  feedback.innerHTML = ' <p><em>' + data + ' is typing a message......</em></p>'
})

//上線人數
socket.on('online', onlineCount => {
  online.innerText = onlineCount

})

//get online users render
socket.on('onlinePPL', data => {
  onlineUsers.push(data)
  let package = ``

  for (let i = 1; i < data.length; i++) {
    package += `
    <div class="row align-items-center">
      <div class="ml-2">
        <img src="${data[i].avatar}" alt="" class="rounded-circle" style="width: 50px">
      </div>

      <div class="ml-2">
        <h4> ${data[i].name} </h4>
      </div>

      <div class="ml-2">
        <h4 style="color:#7B7B7B"> ${data[i].account} </h4>
      </div>
    </div>
    <hr>
    `
  }
  onlineUserContent.innerHTML = package
})

//Output message to DOM
function outPutmessage(message) {
  const div = document.createElement('div')
  div.classList.add('message');

  div.innerHTML = `
  <div class="d-flex flex-row justify-content-center">

  <div class="row align-items-center" style="background-color:#F0F0F0;border-radius: 15px; width: 50%; box-sizing: border-box; left: 50px">

    <div style="padding: 10px;" class="text-center ">${message.username}</span>${message.text}</div>
    </br>

    <small class="send-time text-muted">${message.time}</small>
    
  </div >
  </div>
    `;
  output.appendChild(div)
}


// socket.on('send-chat-message', message => {
//   console.log(message)
// })
