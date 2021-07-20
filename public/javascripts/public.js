const socket = io()
const send = document.getElementById('send')
const login = document.getElementById('login')
const board = document.getElementById('board')
const publicboard = document.getElementById('publicboard')
const input = document.getElementById('message')
const username = document.getElementById('name')
const id = document.getElementById('id')
const avatar = document.getElementById('avatar')

send.addEventListener('click', (e) => {
  e.preventDefault()

  if (input.value) {
    socket.emit('message', { id: Number(id.textContent), avatar: avatar.textContent, user: username.textContent, msg: input.value })
    input.value = ''
  }
})

input.addEventListener('keypress', (e) => {
  if (e.keyCode === 13 && input.value) {
    socket.emit('message', { id: Number(id.textContent), avatar: avatar.textContent, user: username.textContent, msg: input.value })
    input.value = ''
  }
})

socket.on('message', (data) => {
  let newmsg = document.createElement('div')
  if (data.id === Number(id.textContent)) {
    newmsg.classList.add('row', 'flex-row-reverse')
    newmsg.innerHTML =
      `
    <div class="col-1 d-flex justify-content-center align-items-start">
      <a href="/users/${data.id}" class="p-1">
        <img src="${data.avatar}" class="rounded-circle" style="width: 50px; height: 50px" alt="A user" />
      </a>
    </div>
    <div class="col-11 flex-column text-end">
      <p class="text-dark fw-bold mx-0" style="font-size: 0.8em; padding-left: 0.3rem; margin-bottom: 0.3rem;">${data.user}</p>
      <div>
        <p class="d-inline msgblockright">${data.msg}</p>
      </div>
      <p class="text-muted mx-0" style="font-size: 0.675em; padding-left: 0.3rem; margin-top: 0.3rem;">${data.time}</p>
    </div>
    `
    board.appendChild(newmsg)
  } else {
    newmsg.classList.add('row')
    newmsg.innerHTML =
      `
    <div class="col-1 d-flex justify-content-center align-items-start">
      <a href="/users/${data.id}" class="p-1">
        <img src="${data.avatar}" class="rounded-circle" style="width: 50px; height: 50px" alt="A user" />
      </a>
    </div>
    <div class="col-11">
      <p class="text-dark fw-bold mx-0" style="font-size: 0.8em; padding-left: 0.3rem; margin-bottom: 0.3rem;">${data.user}</p>
      <div>
        <p class="d-inline msgblockleft">${data.msg}</p>
      </div>
      <p class="text-muted mx-0" style="font-size: 0.675em; padding-left: 0.3rem; margin-top: 0.3rem;">${data.time}</p>
    </div>
    `
    board.appendChild(newmsg)
  }

  publicboard.scrollTo(0, publicboard.scrollHeight)
})

login.addEventListener('click', (e) => {
  e.preventDefault()
  let loginUserId = socket.request.session.passport
  console.log('loginUser is:', loginUserId)
  if (loginUserId) {
    console.log(`User ${loginUserId} is login!`)
    socket.emit('login', { id: Number(id.textContent), avatar: avatar.textContent, user: username.textContent, msg: input.value })
    input.value = ''
  }
})

socket.on('login', (data) => {
  console.log(`login user is ${data}`)
})