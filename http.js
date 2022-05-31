const http = require('http')
const app = require('./app')
const { Server } = require('socket.io')
//
const server = http.createServer(app)
const io = new Server(server)
const sockets = {}
io.on('connection', socket => {
  const { name } = socket.handshake.query
  if ((!sockets[name]) && socket.handshake.query.name) {
    socket.on('send message', jsonLetter => {
      const { to } = JSON.parse(jsonLetter)
      if (sockets[to]) { sockets[to].emit('send letter', jsonLetter) }
    
    
    
    })

    socket.on('disconnect', function (reason) {
      sockets[name] = null
      delete sockets[name]
      console.log(name, reason, Object.keys(sockets))
    })
    sockets[name] = socket
    console.log(Object.keys(sockets).length)
  }
})
server.listen(3000, () => 1)
