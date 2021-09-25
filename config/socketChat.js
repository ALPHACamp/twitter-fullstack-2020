const { Server } = require("socket.io")

// 加入線上人數計數
let onlineCount = 0;


module.exports = {
  Server(server) {
    io = new Server(server)
  },
  connect() {
    io.on('connection', (socket) => {
      console.log('進入聊天室')

      onlineCount++;// 有連線發生時增加人數
      
      io.emit("online", onlineCount);   // 發送人數給網頁
      //socket.emit("chatRecord", records.get()) // 新增發送紀錄


      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });

      socket.on('disconnect', () => {
        console.log('Bye~');  // 顯示 bye~
        onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;// 使用者離線，扣人
        io.emit("online", onlineCount);
      });


    });
  }
}
