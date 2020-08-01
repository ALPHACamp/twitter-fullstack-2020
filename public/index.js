(function () {
  const socket = io().connect('http://localhost')
  const onlineUser = document.getElementById('online-user')
  const userId = document.getElementById('userId')
  const avatar = document.getElementById('avatar')
  const name = document.getElementById('name')
  const account = document.getElementById('account')
  const sendBtn = document.getElementById('send-message')
  const messageList = document.getElementById('message-list')
  const message = document.getElementById('message')
  const onlineNumber = document.getElementById('online-number')
  const currentUser = {
    id: userId.value,
    avatar: avatar.value,
    name: name.value,
    account: account.value
  }
  socket.emit('join', currentUser)
  socket.on('showOnlineNumber', (number) => {
    onlineNumber.innerHTML = `上線使用者 ${number}`
  })

  // 廣播加入的使用者及在線人數
  socket.emit('attend', { currentUserName: currentUser.name }) // 將currentUserName傳至後端
  socket.on('broadcast', (broadcast) => {
    messageList.innerHTML += `
    <div class="text-center">
      <span class="text-secondary">${broadcast.currentUserName} 已連線！在線人數: ${broadcast.onlineConst}</span>
    </div>
    
    `
  })

  // 按下按鈕呼叫 Server side 的 emit send 動作
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const msg = {
      currentUser,
      message: message.value
    }
    if (message.value === '') {
      message.classList.add('border-danger')
    } else {
      socket.emit('send', msg)
      message.classList.remove('border-danger')
    }
    message.value = ''
  })

  // Server side 呼叫 Client side 的 showMsg
  socket.on('showMsg', (msg) => {
    messageList.innerHTML += `
    <div class="mb-3">
      <img src="${msg.currentUser.avatar}" alt=""
        style="width: 50px; border-radius:50%">
      <span class="ml-3 bg-light" style="max-width:50%">${msg.message}</span>
    </div>
    `
  })
  socket.on('showOnlineUser', (user) => {
    onlineUser.innerHTML += `
    <div class="d-flex align-items-center w-100 border-bottom p-2">
      <img class="rounded-circle" style = "object-fit: cover;" src = "${user.avatar}" width = "50px;" >
      <div class="ml-3">
        <span class="font-weight-bold">${user.name}</span>
        <small class="text-muted ml-1">${user.account}</small>
      </div>
    </div >
    `
  })
})()

function wordsTotal () {
  const total = document.getElementById('userInput').value.length
  if (total > 140) { document.getElementById('display').innerHTML = `<span style="color:red;">${total}/140</span>` } else {
    document.getElementById('display').innerHTML = `<span>${total}/140</span>`
  }
}
function wordsTotal_btn () {
  const total = document.getElementById('userInput_btn').value.length
  if (total > 140) { document.getElementById('display_btn').innerHTML = `<span style="color:red;">${total}/140</span>` } else {
    document.getElementById('display_btn').innerHTML = `<span>${total}/140</span>`
  }
}
