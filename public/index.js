(function () {
  const socket = io().connect('http://localhost')
  const onlineUser = document.getElementById('online-user')
  const userId = document.getElementById('userId')
  const avatar = document.getElementById('user-avatar')
  const name = document.getElementById('user-name')
  const account = document.getElementById('user-account')
  const sendBtn = document.getElementById('sendBtn')
  const messageList = document.getElementById('message-list')
  const message = document.getElementById('message')
  const onlineNumber = document.getElementById('online-number')
  const currentUser = {
    id: userId.value,
    avatar: avatar.value,
    name: name.value,
    account: account.value
  }
  socket.emit('login', currentUser)
  // when login 
  socket.on('onlineInfo', (userList, number) => {
    onlineNumber.innerHTML = `上線使用者 ${userList.length}`
    onlineUser.innerHTML = ``
    userList.forEach(user => {
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
  })
  socket.on('joinMsg', (user) => {
    if (user) {
      messageList.innerHTML += `
      <div class="w-100 d-flex justify-content-center">
        <p class="p-2 bg-light rounded-pill text-secondary" style="max-width: 50%;">${user} 已連線</p>
      </div>`
    }
  })

  // send Message
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const msg = {
      user: currentUser,
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
  socket.on('showMsg', (msg) => {
    if (msg.user.name === currentUser.name) {
      messageList.innerHTML += `
      <div class="w-100 d-flex justify-content-end">
        <p class="my-0 p-2 rounded-lg text-white" style="background-color: #FF6600;max-width:50%; word-break: break-all;">${msg.message}</p>
      </div>
      <small class="text-muted d-flex justify-content-end ">${msg.createdAt}</small>
      `
    }
    else {
      messageList.innerHTML += `
      <div class="w-100 d-flex align-items-center">
        <img src="${msg.user.avatar}" alt="" style="width: 50px; border-radius:50%">
         <p class="ml-2 mb-0 p-2 rounded-lg" style="background-color: #E6ECF1; max-width:50%; word-break: break-all;">${msg.message}</p>
      </div>
      <small class="text-muted d-flex " style="margin-left: 60px;">${msg.createdAt}</small>
      `
    }
  })



  socket.on('leaveMsg', (user) => {
    if (user) {
      messageList.innerHTML += `
      <div class="w-100 d-flex justify-content-center">
        <p class="p-2 bg-light rounded-pill text-secondary" style="max-width: 50%;">${user.name} 離線</p>
      </div>
        `
    }
  })

})()

function wordsTotal() {
  const total = document.getElementById('userInput').value.length
  if (total > 140) { document.getElementById('display').innerHTML = `<span style="color:red;">${total}/140</span>` } else {
    document.getElementById('display').innerHTML = `<span>${total}/140</span>`
  }
}
function wordsTotal_btn() {
  const total = document.getElementById('userInput_btn').value.length
  if (total > 140) { document.getElementById('display_btn').innerHTML = `<span style="color:red;">${total}/140</span>` } else {
    document.getElementById('display_btn').innerHTML = `<span>${total}/140</span>`
  }
}
