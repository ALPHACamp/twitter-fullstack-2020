const { Op } = require('sequelize')
const { Server } = require('socket.io')
const { User, Chat } = require('../models/')
let io 
module.exports = {
  Server(server) {
    io = new Server(server)
  },
  connect() {
    io.on('connection', (socket) => {
      //多人聊天室 裡的行為
      socket.on('chat message', async (msgObj, room) => {

        //當 多人聊天室 有人上線的時候
        if (msgObj.behavior === 'inout' && msgObj.message === 'is entering') {
          // 綁定 socket 和 name，為了待會辨識是誰離開
          socket.senderId = msgObj.senderId
          socket.senderName = msgObj.senderName
          socket.room = 'chatAll'

          // 打包屬於這個人需要的歷史訊息
          // console.log('app.js/line72...sequelize')
          const chats = await Chat.findAll({
            raw: true,
            nest: true,
            order: [['createdAt']],
            include: [User],
            where: { createdAt: { $lt: msgObj.createdAt } },
            where: {
              [Op.and]: [
                { createdAt: { $lt: msgObj.createdAt } },
                { channel: 'chat message' }
              ]
            }
          })

          // 將歷史詢息傳送給剛上線的那個人
          io.emit(`history-${msgObj.senderId}`, chats)

          // 將 「xxx 上線」的訊息廣播到每個人的聊天室
          io.emit('chat message', msgObj)

          // 將「xxx 上線」的這個訊息，寫入資料庫 User --> status
          // console.log('app.js/line88...sequelize')
          const user = await User.findByPk(msgObj.senderId)
          await user.update({ status: 'online' })

          // 推播「xxx 上線」的資訊到每一個人的「誰上線中」頁面
          // console.log('app.js/line93...sequelize')
          const users = await User.findAll({
            raw: true,
            nest: true,
            where: { status: 'online' }
          })
          io.emit('online-users', users)
          // console.log('into app.js/line89...users', users)
        }

        // 當收到一般上線的人在聊天室裡講話的時候
        if (msgObj.behavior === 'live-talk') {

          // 進行廣播，並存到資料庫      
          io.emit('chat message', msgObj)
          // console.log('app.js/line108...sequelize msgObj', msgObj)
          await Chat.create({
            UserId: msgObj.senderId,
            channel: 'chat message',
            behavior: 'live-talk',
            message: msgObj.message
          })
        }
      })

      //私人聊天室 裡的行為
      socket.on('private', async (msgObj, room) => {
        // console.log('into app.js/line142....got private message room', room)

        //如果是首次進入私人聊天室，加入該房間
        if (msgObj.behavior === 'inout' && msgObj.message === 'is entering') {
          //加入房間動作
          socket.join(room)

          // 打包屬於這個人需要的歷史訊息
          // console.log('app.js/line126...sequelize')
          const chats = await Chat.findAll({
            raw: true,
            nest: true,
            order: [['createdAt']],
            include: [User],
            where: {
              [Op.and]: [
                { createdAt: { $lt: msgObj.createdAt } },
                { room: room }
              ]
            }
          })
          //將歷史訊息打包給這個人
          io.emit(`history-${msgObj.senderId}`, chats)
          // console.log('into app.js/line140...chats', chats)
        }

        //當有人在講話
        if (msgObj.behavior === 'live-talk') {
          const user = await User.findByPk(msgObj.senderId)
          let newMsgObj = {
            ...msgObj,
            senderName: user.name,
            senderAvatar: user.avatar
          }
          // 進行群播，並存到資料庫     
          io.to(room).emit('private', newMsgObj)
          // console.log('app.js/line123...sequelize room,msgobj', socket.adapter.rooms)
          await Chat.create({
            UserId: msgObj.senderId,
            channel: 'private',
            behavior: 'live-talk',
            message: msgObj.message,
            room,
          })
        }
      })

      socket.on('disconnect', async () => {
        //判斷為多人聊天室
        // console.log('into app.js/line131...socket', socket)
        if (socket.room === 'chatAll') {
          //當 多人聊天室 有人離線的時候，廣播所有聊天室的人
          io.emit('chat message', {
            behavior: 'inout',
            message: 'has left',
            senderName: socket.senderName
          })

          // 將「xxx 離線」的這個訊息，寫入資料庫 User --> status
          // console.log('app.js/line146...sequelize')
          const user = await User.findByPk(socket.senderId)
          await user.update({ status: 'offline' })

          // 推播更新後的「xxx 上線」的資訊到每一個人的「誰上線中」頁面
          // console.log('app.js/line151...sequelize')
          const users = await User.findAll({
            raw: true,
            nest: true,
            where: { status: 'online' }
          })
          io.emit('online-users', users)
        }
      })
    })
  }

}
