const socket = io()

// message from server

console.log('hi')
socket.emit('message', 'Hi! Robby');

socket.on('chat', data => {
  console.log('Get chat')
  console.log(data)
  // socket.emit('message', 'Hi! Robby');
})
