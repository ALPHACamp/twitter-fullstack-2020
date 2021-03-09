const socket = io()

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const avatar = document.querySelector('.avatar')
const userName = document.querySelector('.user-name')
const userAccount = document.querySelector('.user-account')
const userId = document.querySelector('.user-id')
const historyMsgsBtn = document.querySelector('#historyMsgsBtn')
const historyMessages = document.querySelector('#historyMessages')
const hi = document.querySelector('.hi')
const hello = document.querySelector('.hello')

const currentUser = {
  avatar: avatar.src,
  userId: userId.innerText,
  name: userName.innerText,
  account: userAccount.innerText
}

historyMsgsBtn.addEventListener('click', getHistoryMsgsBtn)

socket.emit('loginUser', currentUser)

socket.on('onlineUser', onlineUser => {
  
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
  getMessage(message)

  chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('chatMessage', (currentUser) => {  
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

  chatMessages.innerHTML += `
  <div class="text-center message">
    <p> ${message} </p>
  </div>  
  `
  
}

// 把當前使用者訊息帶回聊天室窗
function getUserAndMessage(user) {  
  
  if (user.currentUser.userId === currentUser.userId) {
    chatMessages.innerHTML += `
    <div class="text-right message">
      <img src="${user.currentUser.avatar}" style="width: 50px; height: 50px" alt="">  
      <p> ${user.currentUser.name} </p>
      <p> ${user.currentUser.account} </p>
      <p> ${user.msg} </p>
      <p> ${user.time} </p>
    </div>
    `
  } else {
    chatMessages.innerHTML += `
    <div class="message">
      <img src="${user.currentUser.avatar}" style="width: 50px; height: 50px" alt="">  
      <p> ${user.currentUser.name} </p>
      <p> ${user.currentUser.account} </p>
      <p> ${user.msg} </p>
      <p> ${user.time} </p>
    </div>
    `
  }

}

// 歷史訊息
function getHistoryMsgsBtn(e) {  
  chatMessages.children[0].classList.remove('d-none')
  chatMessages.scrollTop = chatMessages.scrollHeight
  e.target.classList.add('d-none')  
}