(function () {
  const socket = io().connect('http://localhost');
  const onlineUser = document.getElementById('online-user')
  const avatar = document.getElementById('user-avatar')
  const name = document.getElementById('user-name')
  const account = document.getElementById('user-account')
  const sendBtn = document.getElementById('send-message')
  const messageList = document.getElementById('message-list')
  const message = document.getElementById('message')
  const onlineNumber = document.getElementById('online-number')
  const currnetUser = {
    avatar: avatar.value,
    name: name.value,
    account: account.value
  }

  // when login 
  socket.on('OnlineInfo', (userList) => {
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
  socket.emit('login', currnetUser)
  socket.on('joinMsg', (msg) => {
    if (msg) {
      messageList.innerHTML +=
        `<div class="mb-1 text-center" style="width:30%;">
        <p class="ml-3 bg-light">${msg} 已連線</p>
      </div>`
    }
  })

  // send Message
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const msg = {
      user: currnetUser,
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
  socket.on('showMsg', (msg) => {
    if (msg.user.name === currnetUser.name) {
      messageList.innerHTML += `
      <div class="w-100 d-flex justify-content-end">
        <p class="m-3 p-2 rounded-lg text-white" style="background-color: #FF6600;max-width:50%; word-break: break-all;">${msg.message}</p>
      </div>`
    }
    else {
      messageList.innerHTML += `
      <div class="w-100 d-flex align-items-center">
        <img src="${msg.user.avatar}" alt="" style="width: 50px; border-radius:50%">
        <p class="m-3 p-2 rounded-lg" style="background-color: #E6ECF1; max-width:50%; word-break: break-all;">${msg.message}</p>
      </div>
      `
    }
  })



  // socket.on('leaveMsg', (msg) => {
  //   if (msg) {
  //     messageList.innerHTML +=
  //       `<div class="mb-1 text-center" style="width:30%;">
  //       <p class="ml-3 bg-light">${msg} 離線</p>
  //     </div>`
  //   }
  // })
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