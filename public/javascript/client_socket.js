(function () {
  console.log('User enter chatroom')
  const chatList = document.querySelector('#chat-list')
  const userId = chatList.dataset.id
  const userAvatar = chatList.dataset.avatar
  let onlineList = ''

  socket.emit('join chat room', userId)
  socket.on('chat list', list => {
    console.log(list)
    onlineList = list
    showUserList(list)
  })

  socket.on('new message', msg => {
    console.log('I get a new message', msg)
  })

  socket.on('new coming', person => {
    console.log('new person joins', person)
  })

  const chatForm = document.querySelector('#send-form')
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const msg = document.querySelector('#msg').value
    const msgInfo = { msg, avatar: userAvatar }
    console.log('user is typing ............', msgInfo)
    socket.emit('chat message', msgInfo)
    document.querySelector('#msg').value = ''
  })

  function showUserList(list) {
    const chatNumber = chatList.querySelector('.main-top')
    const userList = chatList.querySelector('.user-list')
    chatNumber.innerText = `上線使用者(${list.length})`
    console.log('show list')
    let html = ''
    list.forEach(element => {
      html += `
      <img src="${element.avatar}" class="rounded-circle" alt="no avatar">
      <div>${element.name}</div>
      <div>@${element.account}</div>
      `
    })
    userList.innerHTML = html
  }
})()
