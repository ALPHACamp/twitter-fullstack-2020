const time = require('../config/handlebars-helpers').time
const db = require('../models')
const Message = db.Message


module.exports = (io, user, messageToId) => {
  io.on('connection', (socket) => {
    console.log('a user connected')
    // announce user online
    io.emit('message', {
      id: user.id,
      username: user.name,
      account: user.account,
      avatar: user.avatar
    })

    // run when user disconnects
    socket.on('disconnect', () => {
      console.log('user disconnected')
      io.emit('message')
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
        account: user.account,
        avatar: user.avatar,
        message: msg,
        time: time(new Date())
      })
    })

    socket.on('joinRoom', (msg) => {
      Message.create({
        messageFromId: user.id,
        messageToId: messageToId,
        message: msg
      })
      //const roomId = messageToId || user.id.toString() 
      socket.join(messageToId || user.id.toString())
      io.to(user.id.toString()).to(messageToId).emit('privateMessage', {
        id: user.id,
        username: user.name,
        account: user.account,
        avatar: user.avatar,
        message: msg,
        time: time(new Date())
      })
    })
  })
}
