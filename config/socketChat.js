const express = require('express')
const app = express()
const { Server } = require('socket.io')
const db = require('../models')
const User = db.User
const PublicChat = db.PublicChat
const helpers = require('../_helpers')
const dayjs = require('dayjs')




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
      

      // 公開聊天室的行為
      socket.on('chat message', async (userMsg) => {
        try {
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
    });
  }
}
