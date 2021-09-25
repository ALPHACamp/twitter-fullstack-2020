const express = require('express')
const app = express()
const { Server } = require("socket.io")
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')




let onlineCount = 0;// 加入線上人數計數
let onlineUsers = []
let logout = ''
let userId = ''

module.exports = {
  Server(server) {
    io = new Server(server)
  },
  connect() {
    io.on('connection', (socket) => {
      console.log('進入聊天室')
      console.log('客戶端成功連線服務器: ' + socket.id)

      onlineCount++;// 有連線發生時增加人數
      io.emit("online", onlineCount);   // 發送人數給前端


      socket.on('login', (userdata) => {
        console.log('===================================================')
        console.log('後端接收到使用者資料')
        onlineUsers.push(userdata)
        // userdata.socketId = socket.id
        userId = userdata.userId

        const set = new Set()
        // 若 user.id 沒出現過 set 中, 將 user.id 推入 set 中, 後續若有重複 user.id, 會被 filter 略過
        onlineUsers = onlineUsers.filter(user =>
          !set.has(userId) ? set.add(userId) : false)

        io.emit('onlineUser', { onlineUsers })// 發送資料給所有使用者
        console.log(onlineUsers)
      });


      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });

      socket.on('disconnect', () => {
        console.log('Bye~');  // 顯示 bye~

        console.log('===================================================')
        console.log('確認資料放進onlineUsers')
        console.log(onlineUsers)

        onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;// 使用者離線，扣人

        // 登出的使用者 => 資料傳到前端
        logout = onlineUsers.filter(user => {
          return user.socketId === socket.id
        })
        console.log('===================================================')
        console.log('刪除登出使用者資料')
        console.log(logout)

        io.emit('logoutUser', { logout })

      });


    });
  }
}
