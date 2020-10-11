(function () {
  console.log('User enter chatroom')
  const chatList = document.querySelector('#chat-list')
  const chatForm = document.querySelector('#send-form')
  const chatMessages = document.querySelector('.messages')
  const userId = chatList.dataset.id
  const userAvatar = chatList.dataset.avatar

  socket.emit('join chat room', userId)

  socket.on('chat list', list => {
    console.log(list)
    showUserList(list)
  })

  socket.on('new message', msgInfo => {
    console.log('I get a new message', msgInfo)
    chatMessages.innerHTML += `
    <div class='d-flex flex-row justify-content-start my-2'>
        <div class="d-flex align-items-center">
          <img class="message-image rounded-circle mr-2"
            src="${msgInfo.avatar}" alt="">
          <div class="received-message d-flex flex-column align-items-start">
            <div class="message">${msgInfo.msg}</div>
            <small class="received-time text-muted">${msgInfo.createdTime}</small>
          </div>
        </div>
      </div>
    `
  })

  socket.on('new coming', name => {
    console.log('new person joins', name)
    chatMessages.innerHTML += `
    <div class='d-flex flex-row justify-content-center my-2'>
        <div class="status-message">${name} 上線</div>
      </div>
    `
  })
  socket.on('person leaving', name => {
    console.log('user leaves', name)
    chatMessages.innerHTML += `
    <div class='d-flex flex-row justify-content-center my-2'>
        <div class="status-message">${name} 離線</div>
      </div>
    `
  })

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const msg = document.querySelector('#msg').value
    if (msg.trim()) {
      const createdTime = moment().calendar()
      const msgInfo = { msg, avatar: userAvatar, userId, createdTime }
      socket.emit('chat message', msgInfo)
      chatMessages.innerHTML += `
    <div class='d-flex flex-row justify-content-end my-2'>
        <div class="d-flex align-items-center">
          <div class="send-message d-flex flex-column align-items-end ">
            <div class="message">${msg}</div>
            <small class="send-time text-muted">${createdTime}</small>
          </div>
        </div>
      </div>
    `
    }
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
      <div class="single-list d-flex align-items-center">
        <img src="${element.avatar}" class="rounded-circle mr-2" alt="no avatar">
        <div class="mr-2" style="font-style:bold;">${element.name}</div>
        <small class="text-muted">@${element.account}</small>
      </div>
      `
    })
    userList.innerHTML = html
  }
})()
