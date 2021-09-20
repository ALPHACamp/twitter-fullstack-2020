const time = require('../config/handlebars-helpers').time
const db = require('../models')
const Message = db.Message
const User = db.User



module.exports = (io, user, messageToId) => {
  io.on('connection', (socket) => {
    const currentUser = socket.request.session
    console.log('a user connected')

    // announce user online
    User.findOne({
      where: {
        id: socket.request.session.passport ? socket.request.session.passport.user : null
      }
    }).then(user => {
      if(!user) {

      }
      else {
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
          console.log(msg)
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
    
        // room
        socket.on('joinRoom', ({ messageToId, msg }) => {
          console.log(messageToId)
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
    
          //io.to(messageToId).emit('alert')
        })
      }
    }) 
  })
}
