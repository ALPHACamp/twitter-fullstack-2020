const { Server } = require("socket.io")
const db = require('../models')
const User = db.User

// 加入線上人數計數
let onlineCount = 0;


module.exports = {
  Server(server) {
    io = new Server(server)
  },
  connect() {
    io.on('connection', (socket) => {
      console.log('有人公開進入聊天室囉！')
      socket.on("userIn", async (currentUserId) => {
        try {
          const currentUser = await User.findByPk(currentUserId)
          await currentUser.update({publicRoom: true})
          socket.currentUserId = currentUserId //暫存本user的id
          const publicRoomUsers = await User.findAll({
            raw: true,
            nest: true,
            where: { publicRoom: 1 }
          })
          socket.emit('publicRoomUsers', publicRoomUsers)
        } catch (err) {
          console.log(err)
        }
      })
      

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
