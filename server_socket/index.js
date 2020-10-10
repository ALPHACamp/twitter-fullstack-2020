const { User } = require('../models')
let chatroomList = []

async function connectedUsers(newUserId, socketId, io) {
  if (newUserId) {
    const user = await User.findByPk(newUserId)
    const chatUserInfo = {
      name: user.name,
      account: user.account,
      avatar: user.avatar,
      socketId
    }
    chatroomList.push(chatUserInfo)
    io.emit('chat list', chatroomList)
  }
}

function disconnectUser(socketId, io) {
  chatroomList = chatroomList.filter(d => (d.socketId !== socketId))
  console.log('length of the chtroomList', chatroomList.length)
  io.emit('chat list', chatroomList)
}

module.exports = io => {
  io.on('connection', (socket) => {
    socket.on('join chat room', userId => {
      connectedUsers(userId, socket.id, io)
    })
    connectedUsers()
    socket.on('disconnect', () => {
      disconnectUser(socket.id, io)
    })
    // socket.on('chat message', (msg) => {
    //   console.log('message: ' + msg)
    // })
  })
}
