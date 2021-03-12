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
    <div class="d-flex align-items-center">
      <a href="/users/${user.userId}" style="text-decoration: none;">
        <img src="${user.avatar}" style="width: 50px; height: 50px; border-radius: 50%" alt="">
      </a>      
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
    <div class="text-right message d-flex flex-column">      
      <p> ${user.msg} </p>
      <p> ${user.time} </p>
    </div>
    `
  } else {
    chatMessages.innerHTML += `    

    <div class="row no-gutters">

      <div class="col-md-1 m-3">
        <a href="/users/${user.currentUser.userId}" style="text-decoration: none;">
          <img src="${user.currentUser.avatar}" alt="..." style="width: 50px;
      height: 50px; border-radius: 50%">
        </a>
      </div>

      <div class="col-md d-flex flex-column justify-content-center">
        
        <span style="">${user.msg}</span>
        
        <span style="p-0" class="card-text">${user.time}</span>
      </div>

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

{/* <div class="message d-flex">
      <img src="${user.currentUser.avatar}" style="width: 50px; height: 50px; border-radius: 50%" alt="">     
      <div class="flex-column">
        <p> ${user.msg} </p>
        <p> ${user.time} </p>
      </div>
    </div> */}