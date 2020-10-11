const { User, Message, Privatechat } = require('../models')
let chatroomList = []
let privateRoomList = []

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
    io.emit('chat list', chatroomList)
    return false
  })

  // leave private chat
  privateRoomList = privateRoomList.filter(d => {
    if (d.socketId !== socketId) {
      return true
    }
    // io.emit('person leaving', d.name)
    // io.emit('chat list', chatroomList)
    return false
  })

  console.log('length of the chtroomList', chatroomList.length)

}

async function saveMessage(socket, msgInfo) {
  await Message.create({ text: msgInfo.msg, UserId: msgInfo.userId })
  socket.broadcast.emit('new message', msgInfo)
  console.log('message: .......................' + msgInfo)
}

function privateChatList(socket, id, relativeId) {
  const index = privateRoomList.findIndex(e => (e.id === relativeId && e.relativeId === id))
  if (index === -1) {
    const roomID = Math.random().toString(36).substring(2, 13)
    privateRoomList.push({ roomID, socketId: socket.id, id, relativeId })
    socket.join(roomID, () => {
      const rooms = Object.keys(socket.rooms)
      console.log(rooms)
    })
    console.log('length of privateRoomList', privateRoomList.length)
  } else {
    const roomID = privateRoomList[index].roomID
    privateRoomList.push({ roomID, socketId: socket.id, id, relativeId })
    socket.join(privateRoomList[index].roomID, () => {
      const rooms = Object.keys(socket.rooms)
      console.log(rooms)
    })
    console.log('length of privateRoomList', privateRoomList.length)
  }
}

async function privateChat(socket, msgInfo) {
  const index = privateRoomList.findIndex(e => (e.socketId === socket.id))
  if (index === -1) {
    console.log('handle wrong ..............')
  } else {
    await Privatechat.create({ text: msgInfo.msg, UserId: msgInfo.userId, relativeId: msgInfo.relativeId })
    const roomID = privateRoomList[index].roomID
    socket.to(roomID).emit('receive private message', msgInfo)
  }
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
    socket.on('chat message', (msgInfo) => {
      saveMessage(socket, msgInfo)
    })

    socket.on('start private chat', (id, relativeId) => {
      privateChatList(socket, id, relativeId)
      console.log('get........privatechat1234', id, relativeId)
    })
    socket.on('chat private message', (msgInfo) => {
      privateChat(socket, msgInfo)
    })
  })
}
