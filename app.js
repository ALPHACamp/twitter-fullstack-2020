const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes/index')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000
//----------------socket.io-----------------
const http = require('http')
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer)
const moment = require('moment')
//----------------socket.io-----------------

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

//TEST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))


passport(app)
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(routes)

//----------------socket.io-----------------
let onlineUser = []

io.on('connection', (socket) => {
  
  //console.log(socket)   
  socket.on('loginUser', (currentUser) => {    

    const set = new Set()
    onlineUser = onlineUser.filter(item=>!set.has(item.name)?set.add(item.name):false) 
        
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

//----------------socket.io-----------------

httpServer.listen(port, () => console.log(`httpServer is running on port ${port}!`))

module.exports = app
