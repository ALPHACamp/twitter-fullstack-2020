const socket = io()

chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const avatar = document.querySelector('.avatar')
const userName = document.querySelector('.user-name')
const userAccount = document.querySelector('.user-account')
const userId = document.querySelector('.user-id')

const currentUser = {
  avatar: avatar.src,
  userId: userId.innerText,
  name: userName.innerText,
  account: userAccount.innerText
}
//console.log(avatar)
//console.log('currentUser======================', currentUser)
socket.emit('loginUser', currentUser)

socket.on('onlineUser', onlineUser => {
  //console.log('onlineUser======================', onlineUser)
  let nowline = document.querySelector('.nowline')
  nowline.innerText = `上線使用者 ( ${onlineUser.length} )`
  let chatUsers = document.querySelector('.chat-users')
  chatUsers.innerHTML = ``
  onlineUser.forEach(user => {
    chatUsers.innerHTML += `
    <div>
      <img src="${user.avatar}" style="width: 50px; height: 50px" alt="">
      <div>${user.userId}</div>
      <div>${user.name}</div>
      <div>${user.account}</div>
    </div>
    `
  })
})

socket.on('message', message => {
  console.log(message)
  getMessage(message)

  chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('chatMessage', (currentUser) => {
  console.log('currentUser___________________________', currentUser)
  getUserAndMessage(currentUser)
  chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let msg = e.target.elements.msg

  socket.emit('chatMessage', { currentUser, msg: msg.value })

  msg.value = ''
  msg.focus()

})

// 把訊息帶回聊天室窗
function getMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `
  <p> ${message} </p>
    
  `
  chatMessages.appendChild(div)
}

// 把當前使用者訊息帶回聊天室窗
function getUserAndMessage(user) {  
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `
  <img src="${user.currentUser.avatar}" style="width: 50px; height: 50px" alt="">  
  <p> ${user.currentUser.name} </p>
  <p> ${user.currentUser.account} </p>
  <p> ${user.msg} </p>
  <p> ${user.time} </p>
  `
  chatMessages.appendChild(div)
}


    // <p> ${message.username} </p>
    // <p> ${message.text} </p>
    // <p> ${message.time} </p>