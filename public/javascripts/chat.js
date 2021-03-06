chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

const socket = io()

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
console.log(currentUser)
socket.emit('loginUser', currentUser)

socket.on('onlineUser', onlineUser => {
  console.log(onlineUser)
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
  div.innerHTML = `
    <p> ${message.username} </p>
    <p> ${message.text} </p>
    <p> ${message.time} </p>
  `
  chatMessages.appendChild(div)
}