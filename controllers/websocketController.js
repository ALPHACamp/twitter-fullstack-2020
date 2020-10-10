const time = require('../config/handlebars-helpers').time
const db = require('../models')
const Message = db.Message
 

module.exports = (io, user) => {
  io.once('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

    // listen for chat message
    socket.on('chatMessage', (msg) => {
      Message.create({
        messageFromId: user.id,
        message: msg
      })
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
