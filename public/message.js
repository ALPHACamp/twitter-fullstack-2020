var socket = io()

const chatForm = document.getElementById('chat-form')
const chatMessages = document.getElementById('chat-messages')

//online user
socket.on('message', (data) => {
  appendUserData(data)
})
  
function appendUserData(data) {
  const u = document.getElementById('user-list')
  let htmlString 
  htmlString = `
    <div class="flex-container">
      <div class="mr-2">
        <a href="/users/${data.id}/tweets">
          <img src="${data.avatar}" alt="user avatar" class="user-avatar"
            style="border-radius: 50%; height:50px; width: 50px">
        </a>
      </div>
      <div style="display: flex; align-items: center">
        <a href="/users/${data.id}/tweets" style="text-decoration:none; color:black"><strong>${data.username}</strong></a>
        <font class="text-muted"> @${data.account}</font>
      </div>
    </div>
  `
  var li = document.createElement('li')
  li.className = 'list-group-item'
  li.innerHTML = htmlString
  u.appendChild(li)
}

//send message
chatForm.addEventListener('submit', e => {
  e.preventDefault()
  const msg = e.target.elements.message.value

  const selector = document.querySelector('.selector')
  if (selector.value === 'public') {
    //public message
    socket.emit('chatMessage', msg)
  }
  else {
    //private message
    const messageToId = window.location.pathname.split('/')[2]
    socket.emit('joinRoom', {messageToId, msg})
  }
  //clear inputs
  e.target.elements.message.value = ''
})

const privateMessage = document.body.getElementById('private-message')
privateMessage.addEventListener('click', e => {
  //private message
  const messageToId = window.location.pathname.split('/')[2]
  console.log('cccc')
  console.log(messageToId)
  socket.emit('joinRoom', {messageToId, msg})
})



//public message
socket.on('chatMessage', (data) => {
  appendData(data)
  console.log(data)
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//private message
socket.on('privateMessage', (data) => {
  appendData(data)
  console.log(data)

  chatMessages.scrollTop = chatMessages.scrollHeight
})

function appendData(data) {
  const loginUserId = document.getElementById('loginUserId').value
  const el = document.getElementById('chat-messages')
  let htmlString
  if (Number(data.id) === Number(loginUserId)) {
    htmlString = `
      <div class="m-2">
        <section style="background-color:coral; float: right; width:270px; border-radius:20px; padding:6px; float:right;">
          ${data.message}
        </section>
        <font class="text-muted" size="2px" style="float: right;">${data.time}</font>
        <div class="clearfix"></div>
      </div>
    `
  } 
  else {
    htmlString = `
    <div class="flex-container m-2">
      <div>
        <img src="${data.avatar}" class="user-avatar" style="margin-right:4px;">
      </div>
      <div>
      <section style="background-color:lightgrey; float: right; width:270px; border-radius:20px; padding:6px;">
        ${data.message}
      </section>
        
      <font class="text-muted" size="2px">${data.time}</font>
    </div>

    `
  }
  el.appendChild((document.createElement('div'))).innerHTML = htmlString
}

// //alert
// socket.on('alert', () => {
//   const privateMessage = document.getElementById('private-message')
//   let htmlString = `
//   <div style="border:4px red solid;border-radius:2px;" ></div>
//   `
//   console.log(htmlString)
//   privateMessage.appendChild((document.createElement('div'))).innerHTML = htmlString
// })