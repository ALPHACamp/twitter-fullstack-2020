(function () {
  console.log('User enter chatroom')
  var socket = io('ws://localhost:3000/')
  socket.emit('chat message', 'I am in')
})()
