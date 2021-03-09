module.exports = (httpServer) => {
  const io = require('socket.io')(httpServer)
  const moment = require('moment')
  const db = require('../models')
  const Message = db.Message

  let onlineUser = []

  io.on('connection', (socket) => {  
      
    socket.on('loginUser', (currentUser) => {    
      
      const set = new Set()
      onlineUser = onlineUser.filter(user => !set.has(user.name) ? set.add(user.name) : false) 
          
      onlineUser.push(currentUser)    
      
      io.emit('onlineUser', onlineUser)      
      
      socket.emit('message', `welcome ${currentUser.name}`)
      socket.broadcast.emit('message', `${currentUser.name} 上線`)
      socket.on('disconnect', () => {   
        io.emit('message', `${currentUser.name} 離線`)
        onlineUser = onlineUser.filter(user => user !== currentUser)        
        io.emit('onlineUser', onlineUser)      
      })
      
    })

    //監聽聊天訊息
    socket.on('chatMessage', (user) => {
      Message.create({
        UserId: user.currentUser.userId,
        message: user.msg
      })      
      user.time = moment().format('a h:mm') 
      io.emit('chatMessage', (user))
    })
    
  });
  
}


