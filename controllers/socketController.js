let onlineUsers = []
let onlineCounts = 0
let onlineUserPop = ''
const db = require('../models') 
const User = db.User 
const PublicMsg = db.PublicMsg
const moment = require('moment')

module.exports = (io) => {
  io.on('connection', (socket) => {
    //有登入
    socket.on('login', async() => {
      const sessionUserId = socket.request.session.passport.user
      const userFilter = onlineUsers.find(item => item.id === sessionUserId)
      if (!userFilter) {
        let user =  await User.findByPk(sessionUserId)
        user = user.toJSON()
        onlineUsers.push({
          id: user.id,
          name: user.name,
          account: user.account,
          avatar: user.avatar
        })
        onlineCounts = onlineUsers.length
        onlineUserPop = user.name
      }
      io.emit('onlineUsers', onlineUsers)
      io.emit('onlineCounts', onlineCounts)
      io.emit('onlineUserPop', onlineUserPop)
      
    })
    console.log('a user connected')

    //來自client 的事件名稱 chat message
    socket.on('chat message', async(data) => {
      await PublicMsg.create({
        UserId: data.id,
        content: data.msg
      })
      data['time'] = moment().fromNow()
      //要對所有 Client 廣播的事件名稱 chat message
      io.emit('chat message', data);
    });
    //沒登入
    socket.on('disconnect', () => {
      console.log('user disconnected')
      const sessionUserId = socket.request.session.passport ? socket.request.session.passport.user : null
      onlineUsers = onlineUsers.filter((item) => item.id !== sessionUserId)
      onlineCounts = onlineUsers.length
      //要對所有 Client 廣播的事件名稱 onlineCount onlineUsers outlineUserPop
      io.emit('onlineCounts', onlineCounts)
      io.emit('onlineUsers', onlineUsers)
      io.emit('outlineUserPop', onlineUserPop)

    })
  })
}