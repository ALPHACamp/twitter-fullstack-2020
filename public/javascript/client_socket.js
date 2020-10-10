(function () {
  console.log('User enter chatroom')
  const chatList = document.querySelector('#chat-list')
  const userId = chatList.dataset.id
  var socket = io('ws://localhost:3000/')
  socket.emit('join chat room', userId)
  socket.on('chat list', list => {
    showUserList(list)
  })
  // socket.emit('chat message', 'user id =' + userId)

  function showUserList(list) {
    console.log(list)
  }
})()
