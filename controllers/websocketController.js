const time = require('../config/handlebars-helpers').time



module.exports = (io, user) => {
  io.once('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')
      socket.removeAllListeners()
    })

    // listen for chat message
    socket.on('chatMessage', (msg) => {
      io.emit('chatMessage', {
        id: user.id,
        username: user.name,
        avatar: user.avatar,
        message: msg,
        time: time(new Date())
      })
    })
  })
}
