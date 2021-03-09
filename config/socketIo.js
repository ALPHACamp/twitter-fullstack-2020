module.exports = (httpServer) => {
  const io = require('socket.io')(httpServer)
  const moment = require('moment')

  let onlineUser = []

  io.on('connection', (socket) => {  
    //console.log(socket)   
    socket.on('loginUser', (currentUser) => {    
      
      const set = new Set()
      onlineUser = onlineUser.filter(user => !set.has(user.name) ? set.add(user.name) : false) 
          
      onlineUser.push(currentUser)    
      
      io.emit('onlineUser', onlineUser)
      
      console.log('onlineUser in login', onlineUser)
      // ---------------
      socket.emit('message', `welcome ${currentUser.name}`)
      socket.broadcast.emit('message', `${currentUser.name} 上線`)
      socket.on('disconnect', () => {   
        io.emit('message', `${currentUser.name} 離線`)
        onlineUser = onlineUser.filter(user => user !== currentUser)
        console.log('onlineUser in logout', onlineUser)
        io.emit('onlineUser', onlineUser)      
      })
      // ---------------
    }) 
  
    //socket.emit('message', `welcome ${socket.id}`)
    
    //顯示加入聊天室訊息給全部的人
    //socket.broadcast.emit('message', `${socket.id} 上線`)  
    
    // socket.on('disconnect', () => {   
    //   io.emit('message', `${socket.id} 離線`)
      
    //   console.log('gone')
    // })

    //監聽聊天訊息
    socket.on('chatMessage', (user) => {
      //console.log('currentUser*****************', user)
      user.time = moment().format('a h:mm') 
      io.emit('chatMessage', (user))
    })
    
  });
  
}


