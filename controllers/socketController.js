let onlineUsers = []
let onlineCounts = 0
let onlineUserPop = ''
const db = require('../models') 
const User = db.User
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
      

      
      onlineUsers
      // let onlineUsers = onlineUsers.find(item => item.id === idFromSession)
      
    })
    console.log('a user connected')
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
      console.log(msg)
    });
    //沒登入
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
}