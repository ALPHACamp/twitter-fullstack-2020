const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const app = express()
const db = require('./models')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const User = db.User
const formatMessage = require('./public/messages.js');

// chatroom參數
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app);
const io = socketio(server)

//flash
const flash = require('connect-flash')
const session = require('express-session')

app.use(bodyParser.urlencoded({ extended: true }))


app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')

app.use(methodOverride("_method"));

app.use('/upload', express.static(__dirname + '/upload'))


// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(methodOverride('_method'))


//pssport初始化與啟動session
app.use(passport.initialize())
app.use(passport.session())

// 把 req.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

//使用public 資料夾
app.use(express.static('public'))


server.listen(port, () => console.log(`Example app listening on port ${port}!`))

//以下為chatroom
//current user 
let id, name, account, avatar
app.use((req, res, next) => {
  if (helpers.getUser(req)) {
    ({ id, name, account, avatar } = helpers.getUser(req))
    console.log("user是", name)
  }
  next()
})

let onlineUsers = []

let onlineCount = 0

//run with client connects
io.on('connection', socket => {
  // 有連線發生時增加人數
  onlineCount++;
  // 發送人數給網頁
  io.emit("online", onlineCount)

  // online user list
  onlineUsers.push({ id, name, account, avatar });
  let set = new Set();
  onlineUsers = onlineUsers.filter((item) =>
    !set.has(item.id) ? set.add(item.id) : false,
  );
  const user = onlineUsers.find((user) => user.id === id);
  user.current = true;

  //online users
  io.emit('onlinePPL', onlineUsers)

  //Welcome current user
  socket.emit('message', formatMessage(' ', 'You join the chatroom'))

  //broadcast when a user connects
  socket.broadcast.emit('message', formatMessage(user.name, ' has joined the chat'))

  //Runs when client disconnects
  socket.on('disconnect', () => {
    // 有人離線, 扣人數
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
    io.emit("online", onlineCount)
    io.emit('onlinePPL', onlineUsers)

    io.emit('message', formatMessage(user.name, ' has left the chat'))
  });

  socket.on('chat-message', data => {
    io.sockets.emit('chat-message', data)
    console.log("chatroom client 傳來的資訊 ", data)  //{message: , avatar, name}
  })

  //handle chat event
  socket.on('chat', data => {
    io.sockets.emit('chat', data);
  })

  // Runs when a user is typing
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data)
  })


  console.log("user", onlineUsers)


})












require('./routes')(app, passport) // passport 傳入 routes
