const socket = io('http://localhost:3000/oneChatroom')
const id = document.querySelector('#id')
const myMassage = document.querySelector('#myMassage')



socket.emit('say-to-someone', {
    UserId: id.value,
    name: name.value,
    avatar: avatar.value,
    account: account.value
  })

chatForm.addEventListener('click', (e) => {
    
    let whichUser = {
      UserId: id.value,
      name: name.value,
      avatar: avatar.value,
      account: account.value,
      time: new Date(),
      message: message.value
    }
    
    socket.emit('chat_msg', msg)
    message.value = ''
    })