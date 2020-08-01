module.exports = (server) => {
  const io = require('socket.io')(server)
  const connections = []
  const userList = []

  io.on('connection', socket => {
    connections.push(socket)
    console.log(`${socket.id} 已連線！,在線人數:${connections.length}`)

    socket.on('join', (user) => {
      userList.push(user)
      io.emit('showOnlineUser', userList);
      io.emit('showOnlineNumber', userList.length)
      io.emit('joinMsg', `${user.name} 已連線`)
    })

    socket.on('send', (msg) => {
      io.emit('showMsg', msg)
    })

    socket.on('disconnect', () => {
      connections.splice(0, 1)
      console.log(`使用者已離開！,在線人數:${connections.length}`)
    })
  })
}
