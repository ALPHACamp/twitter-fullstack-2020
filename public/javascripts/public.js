const socket = io()
const send = document.getElementById('send')
const board = document.getElementById('board')
const publicboard = document.getElementById('publicboard')
const input = document.getElementById('message')
const username = document.getElementById('name')
const id = document.getElementById('id')
const avatar = document.getElementById('avatar')
const onlinePeople = document.getElementById('onlinePeople')
const publicPeople = document.getElementById('publicPeople')
const onlineCount = document.getElementById('onlineCount')

send.addEventListener('click', (e) => {
  e.preventDefault()

  if (input.value) {
    socket.emit('message', { id: Number(id.textContent), avatar: avatar.textContent, user: username.textContent, msg: input.value })
    input.value = ''
    console.log('click')
  }
})

input.addEventListener('keypress', (e) => {
  if (e.keyCode === 13 && input.value) {
    socket.emit('message', { id: Number(id.textContent), avatar: avatar.textContent, user: username.textContent, msg: input.value })
    input.value = ''
    console.log('keypress')
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

socket.emit('login')

socket.on('onlineUsers', (onlineUsers) => {
  onlinePeople.innerHTML = ''
  onlineUsers.forEach(onlineUsers => {
    addUser(onlineUsers)
  })
  // publicPeople.scrollTo(0, publicPeople.scrollHeight)
})

function addUser(data) {
  const htmlString = `
  <div class="row justify-content-start align-items-center px-2 py-1 rounded hovercard"
    style="border: 1px solid rgba(0, 0, 0, 0.1); margin-bottom: 3px;" onclick="location.href='/users/${data.id}'">
    <div class="col-2 d-flex justify-content-center align-items-center" id="onlineUsers">
      <img src="${data.avatar}" width="50" height="50" class="rounded-circle">
    </div>
    <div class="col-6 d-flex" style="height: 60px;">
      <h5 style="line-height: 60px;">${data.name}</h5>
      <p class="text-muted ps-2" style="font-size: 0.875em; line-height: 60px;">
        @${data.account}</p>
    </div>
  </div>
  `
  onlinePeople.innerHTML += htmlString
}

socket.on('onlineCount', (data) => {
  onlineCount.innerText = data
})

socket.on('onlineList', (data) => {
  let onlineList = document.createElement('ul')
  onlineList.classList.add('list-group', 'd-flex', 'flex-column', 'align-items-center')
  onlineList.innerHTML = `
    <li class="list-group-item mt-2 rounded-pill btn-sm" style="background-color:lightgray">${data.name} 上線了</li>
  `
  board.appendChild(onlineList)
  publicboard.scrollTo(0, publicboard.scrollHeight)
})

socket.on('outlineList', (data) => {
  if (data.name) {
    let outlineList = document.createElement('ul')
    outlineList.classList.add('list-group', 'd-flex', 'flex-column', 'align-items-center')
    outlineList.innerHTML = `
    <li class="list-group-item mt-2 rounded-pill btn-sm" style="background-color:lightgray">${data.name} 離線了</li>
  `
    board.appendChild(outlineList)
    publicboard.scrollTo(0, publicboard.scrollHeight)
  }

})
