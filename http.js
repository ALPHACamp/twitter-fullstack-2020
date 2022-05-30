const http = require('http')
const app = require('./app')
const { Server } = require('socket.io')
//
const server = http.createServer(app)
const io = new Server(server)
const sockets = {}
const conS = JSON.stringify({ content: '成功連線' })
io.on('connection', socket => {
  const { name } = socket.handshake.query
  if ((!sockets[name]) && socket.handshake.query.name) {
    socket.on('send message', jsonLetter => {
      const { to } = JSON.parse(jsonLetter)
      sockets[to].emit('send letter', jsonLetter)
    })
    socket.on('disconnect', jsonname =>{
      const name = JSON.parse(jsonname)
      delete sockets[name]
    })
    sockets[name] = socket
  }
  console.log(Object.keys(sockets))
})
server.listen(3000, () => 1)
