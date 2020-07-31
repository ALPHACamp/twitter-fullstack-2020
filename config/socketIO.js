module.exports = (server) => {
  const io = require('socket.io')(server)
  const connections = []

  io.on('connection', socket => {
    connections.push(socket)
    console.log(`${socket.id} 已連線！,在線人數:${connections.length}`)
    socket.on('disconnect', () => {
      connections.splice(0, 1)
      console.log(`使用者已離開！,在線人數:${connections.length}`)
    })
  })
}
