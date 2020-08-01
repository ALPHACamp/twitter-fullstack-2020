(function () {
  const socket = io().connect('http://localhost');
  const onlineUser = document.getElementById('online-user')
  const avatar = document.getElementById('avatar')
  const name = document.getElementById('name')
  const account = document.getElementById('account')
  const sendBtn = document.getElementById('send-message')
  const messageList = document.getElementById('message-list')
  const message = document.getElementById('message')
  const onlineNumber = document.getElementById('online-number')
  const currnetUser = {
    avatar: avatar.value,
    name: name.value,
    account: account.value
  }
  socket.emit('join', currnetUser)
  socket.on('showOnlineNumber', (number) => {
    onlineNumber.innerHTML = `上線使用者 ${number}`
  })
  socket.on('joinMsg', (msg) => {
    messageList.innerHTML +=
      `<div class="mb-1 text-center" style="width:30%;">
        <p class="ml-3 bg-light">${msg}</p>
      </div>`
  })
  socket.on('showOnlineUser', (userList) => {
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

  socket.on('showMsg', (msg) => {
    messageList.innerHTML += `
    <div class="mb-3">
      <img src="${msg.currnetUser.avatar}" alt=""
        style="width: 50px; border-radius:50%">
      <span class="ml-3 bg-light" style="max-width:50%">${msg.message}</span>
    </div>
    `
  })
  // 按下按鈕呼叫 Server side emit send 
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const msg = {
      currnetUser,
      message: message.value
    }
    if (message.value === "") {
      message.classList.add('border-danger')
    }
    else {
      socket.emit('send', msg)
      message.classList.remove('border-danger')
    }
    message.value = ""
  })

})()

function wordsTotal() {
  let total = document.getElementById('userInput').value.length;
  if (total > 140)
    document.getElementById('display').innerHTML = `<span style="color:red;">${total}/140</span>`;
  else {
    document.getElementById('display').innerHTML = `<span>${total}/140</span>`;
  }
}
function wordsTotal_btn() {
  let total = document.getElementById('userInput_btn').value.length;
  if (total > 140)
    document.getElementById('display_btn').innerHTML = `<span style="color:red;">${total}/140</span>`;
  else {
    document.getElementById('display_btn').innerHTML = `<span>${total}/140</span>`;
  }
}