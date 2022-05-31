const http = require('http')
const app = require('./app')
const { Server } = require('socket.io')
//
const server = http.createServer(app)
const io = new Server(server)
const sockets = {}
io.on('connection', socket => {
  // const { userId } = socket.handshake.query
  // if ((!sockets[userId]) && socket.handshake.query.name) {
  //   socket.on('send message', jsonLetter => {
  //     const { to } = JSON.parse(jsonLetter)
  //     if (sockets[to]) { sockets[to].emit('send letter', jsonLetter) }
  //   })

  //   socket.on('disconnect', function (reason) {
  //     sockets[userId] = null
  //     delete sockets[userId]
  //     console.log(userId, reason, Object.keys(sockets))
  //   })
  // sockets[userId] = socket
  console.log('success')
  // }
})
server.listen(3000, () => 1)
