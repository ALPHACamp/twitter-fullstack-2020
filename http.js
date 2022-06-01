const http = require('http')
const app = require('./app')
const { Server } = require('socket.io')
const { Message } = require('./models')
//
const server = http.createServer(app)
const io = new Server(server)
const sockets = {}
io.on('connection', socket => {
  const { userId } = socket.handshake.query
  if ((!sockets[userId]) && userId) {
    socket.on('post message', async (message) => {
      const { senderId, receiverId } = JSON.parse(message)
      // function :store into database
      Message.create(JSON.parse(message))
      if (sockets[receiverId]) {
        sockets[receiverId].emit('get message', message)
        sockets[receiverId].emit('notify user', senderId)
      }
    })
    socket.on('disconnect', reason => {
      sockets[userId] = null
      delete sockets[userId]
      console.log(userId, ' delete:', reason)
    })
    sockets[userId] = socket
    socket = null
  }
  console.log('success', userId)
})
server.listen(3000, () => 1)
