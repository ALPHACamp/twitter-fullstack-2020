const { Server } = require("socket.io")

module.exports = {
  Server(server) {
    io = new Server(server)
  },
  connect() {
    io.on('connection', (socket) => {
      console.log('進入聊天室')
      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
      socket.on('disconnect', () => {
        console.log('Bye~');  // 顯示 bye~
      });
    });
  }
}
