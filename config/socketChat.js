const express = require('express')
const app = express()
const { Server } = require('socket.io')
const db = require('../models')
const User = db.User
const PublicChat = db.PublicChat
const helpers = require('../_helpers')
const dayjs = require('dayjs')




// let onlineCount = 0;// 加入線上人數計數
// let onlineUsers = []
// let logout = ''
// let userId = ''

function timeConvert (time) {
  const amPm = dayjs(time).format('A') === 'PM' ? '下午' : '上午'
  const hourMinute = dayjs(time).format('HH:mm')
  const formatTime = amPm + hourMinute
  return formatTime
}

module.exports = {
  Server (server) {
    io = new Server(server)
  },
  connect() {
    io.on('connection', (socket) => {
      console.log('有人進入公開聊天室囉！')
      socket.on("userIn", async (userMsg) => {
        try {
          //運用socket儲存值
          socket.currentUserId = userMsg.senderId
          const currentUser = await User.findByPk(userMsg.senderId)
          await currentUser.update({publicRoom: true})
          const publicRoomUsers = await User.findAll({
            raw: true,
            nest: true,
            where: { publicRoom: 1 }
          })
          const historyPublicChats = await PublicChat.findAll({
            raw: true,
            nest: true,
            order: [['createdAt']],
            include: [User]
          })     
          io.emit(`historyPublicChats-${userMsg.senderId}`, historyPublicChats)
          io.emit('publicRoomUsers', publicRoomUsers)
          if (userMsg.behavior === 'enter-public') {
            // 廣播上線資訊給大家
            io.emit('chat message', userMsg)
          }
        } catch (err) {
          console.log(err)
        }
      })
      socket.on('disconnect', async () => {
        console.log('socket.currentUserId', socket.currentUserId)
        const offUser = await User.findByPk(socket.currentUserId)
        // 將使用者判定離線存入資料庫
        await offUser.update({ publicRoom: 0 })
        const publicRoomUsers = await User.findAll({
          raw: true,
          nest: true,
          where: { publicRoom: 1 }
        })
        // 因有使用者離線，重新更新使用者上線名單與人數
        io.emit('publicRoomUsers', publicRoomUsers)
      })
      
      // console.log('進入聊天室')
      // console.log('客戶端成功連線服務器: ' + socket.id)

      // onlineCount++;// 有連線發生時增加人數
      // io.emit("online", onlineCount);   // 發送人數給前端


      // socket.on('login', (userdata) => {
      //   console.log('===================================================')
      //   console.log('後端接收到使用者資料')
      //   onlineUsers.push(userdata)
      //   // userdata.socketId = socket.id
      //   userId = userdata.userId

      //   const set = new Set()
      //   // 若 user.id 沒出現過 set 中, 將 user.id 推入 set 中, 後續若有重複 user.id, 會被 filter 略過
      //   onlineUsers = onlineUsers.filter(user =>
      //     !set.has(userId) ? set.add(userId) : false)

      //   io.emit('onlineUser', { onlineUsers })// 發送資料給所有使用者
      //   console.log(onlineUsers)
      // });



      // 公開聊天室的行為
      socket.on('chat message', async (userMsg) => {
        try {
          // if (userMsg.behavior === 'enter-public') {
          //   // 廣播上線資訊給大家
          //   io.emit('chat message', userMsg)
          // }

          if (userMsg.behavior === 'public-chat') {
            await PublicChat.create({
              UserId: userMsg.senderId,
              message: userMsg.senderMsg
            })
            // 設置時間格式
            userMsg.createdAt = timeConvert(userMsg.createdAt)
            // 廣播新訊息給大家
            io.emit('chat message', userMsg);
          }
        } catch (err) {
          console.log(err)
        }
        
      });

      // socket.on('disconnect', () => {
      //   console.log('Bye~');  // 顯示 bye~

      //   console.log('===================================================')
      //   console.log('確認資料放進onlineUsers')
      //   console.log(onlineUsers)

      //   onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;// 使用者離線，扣人

      //   // 登出的使用者 => 資料傳到前端
      //   logout = onlineUsers.filter(user => {
      //     return user.socketId === socket.id
      //   })
      //   console.log('===================================================')
      //   console.log('刪除登出使用者資料')
      //   console.log(logout)

      //   io.emit('logoutUser', { logout })

      // });


    });
  }
}
