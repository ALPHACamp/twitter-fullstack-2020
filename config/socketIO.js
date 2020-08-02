module.exports = (server) => {
  const { moment_message } = require('./hbs-helpers')
  const db = require('../models')
  const Message = db.Message
  const io = require('socket.io')(server)
  const connections = []
  let userList = []
  io.on('connection', socket => {
    let addedUser = false

    socket.on('login', (user) => {
      if (addedUser) return

      // store the username in the socket session for this client
      socket.user = user
      userList.push(user)
      addedUser = true
      io.emit('onlineInfo', userList)
      socket.broadcast.emit('joinMsg', `${user.name}`)
    })

    socket.on('send', (msg) => {
      Message.create({
        UserId: msg.user.id,
        content: msg.message
      }).then((message) => {
        message = message.toJSON()
        msg.createdAt = moment_message(message.createdAt)
        console.log(message)
        io.emit('showMsg', msg)
      })
    })

    socket.on('disconnect', () => {
      if (addedUser) {
        userList = userList.filter(user => user !== socket.user)
        socket.broadcast.emit('onlineInfo', userList)
        socket.broadcast.emit('leaveMsg', socket.user)
      }
    })
  })
}

