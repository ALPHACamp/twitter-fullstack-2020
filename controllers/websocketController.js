const time = require('../config/handlebars-helpers').time
const db = require('../models')
const Message = db.Message
let addUser = false

module.exports = (io, user) => {
  io.on('connection', (socket) => {
    console.log('a user connected')
    // announce user online
    if (addUser) return
    else {
      io.emit('message', {
        id: user.id,
        username: user.name,
        account: user.account,
        avatar: user.avatar
      })
      addUser = true
    }

    // run when user disconnects
    socket.on('disconnect', () => {
      console.log('user disconnected')
      io.emit('message')
      addUser = false
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
  })
}
