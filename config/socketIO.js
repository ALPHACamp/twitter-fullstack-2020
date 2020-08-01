module.exports = (server) => {
  const io = require('socket.io')(server)
  const connections = []

  io.on('connection', socket => {
    connections.push(socket)
    console.log(`${socket.id} 已連線！,在線人數:${connections.length}`)

    // 廣播加入的使用者及在線人數
    socket.on('attend', (attend) => { // 接收前端傳來的currentUserName
      socket.broadcast.emit('broadcast', { onlineConst: connections.length, currentUserName: attend.currentUserName })
    })

    io.emit('showOnlineNumber', connections.length)

    socket.on('join', (user) => {
      io.emit('showOnlineUser', user)
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
