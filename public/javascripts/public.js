const socket = io()
const send = document.getElementById('send')
const board = document.getElementById('board')
const publicboard = document.getElementById('publicboard')
const input = document.getElementById('message')
const username = document.getElementById('name')
const id = document.getElementById('id')
const avatar = document.getElementById('avatar')
const onlineList = document.getElementById('onlineList')
const outlineList = document.getElementById('outlineList')
const onlinePeople = document.getElementById('onlinePeople')
const publicPeople = document.getElementById('publicPeople')
const onlineCount = document.getElementById('onlineCount')

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

socket.emit('login')

socket.on('onlineUsers', (data) => {
  onlinePeople.innerHTML = ''
  data.forEach(data => {
    addUser(data)
  })
  publicPeople.scrollTo(0, publicPeople.scrollHeight)
})

function addUser (data) {
  const htmlString = `
  <li class="list-group-item hovercard" style="border-left: none;border-right: none;height:5rem">
  <div class="row justify-content-start align-items-center">
  <div class="col-2 d-flex justify-content-center align-items-center" style="padding-left: 20px;" id="onlineUsers">
                <a href="/users/${data.id}">
                  <img src="${data.avatar}" alt="" width="50" height="50" class="rounded-circle">
                </a>
              </div>
              <div class="col-6 ps-3 pt-3 d-flex">
                <p id="id" class="d-none">${data.id}</p>
                <p id="avatar" class="d-none">${data.avatar}</p>
                <h5 id='name' style="line-height: 18px;">${data.name}</h5>
                <p class="text-muted" style="line-height:16px; margin-left: 5px;">@${data.account}</p>
              </div>
              </div>
              </li>
              `
  onlinePeople.innerHTML += htmlString
}

socket.on('onlineCount', (data) => {
  onlineCount.innerText = data
})

socket.on('onlineList', (data) => {
  const htmlString = `<li class="list-group-item mt-2 rounded-pill btn-sm" style="background-color:lightgray">${data.name} 上線了</li>`
  onlineList.innerHTML += htmlString
})

socket.on('outlineList', (data) => {
  const htmlString = `<li class="list-group-item mt-2 rounded-pill btn-sm" style="background-color:lightgray">${data.name} 離線了</li>`
  outlineList.innerHTML += htmlString
})
