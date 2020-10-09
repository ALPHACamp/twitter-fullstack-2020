module.exports = (io, user) => {
  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

    // listen for chat message
    socket.on('chatMessage', (msg) => {
      io.emit('chatMessage', {
        username: user.name,
        avatar: user.avatar,
        message: msg
      })
    })
  })
}
