const { User } = require('../models')
let chatroomList = []

async function joinChatroomList(newUserId, socketId, io, socket) {
  if (newUserId) {
    const user = await User.findByPk(newUserId)
    const chatUserInfo = {
      id: newUserId,
      name: user.name,
      account: user.account,
      avatar: user.avatar,
      socketId
    }
    chatroomList.push(chatUserInfo)
    io.emit('chat list', chatroomList)
    socket.broadcast.emit('new coming', chatUserInfo.name)
  }
}

function disconnectUser(socketId, io) {
  // disconnect from chatroom
  chatroomList = chatroomList.filter(d => {
    if (d.socketId !== socketId) {
      return true
    }
    io.emit('person leaving', d.name)
    return false
  })
  console.log('length of the chtroomList', chatroomList.length)
  io.emit('chat list', chatroomList)
}

module.exports = io => {
  io.on('connection', (socket) => {
    console.log('user connect socketid=', socket.id)
    socket.on('join chat room', userId => {
      joinChatroomList(userId, socket.id, io, socket)
    })
    socket.on('disconnect', () => {
      disconnectUser(socket.id, io)
    })
    socket.on('chat message', (msg) => {
      socket.broadcast.emit('new message', msg)
      console.log('message: .......................' + msg)
    })
  })
}
