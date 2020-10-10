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

let id, name, account, avatar



//chat 

const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app);
const io = socketio(server)


const users = {}
let onlineCount = 0

//run with client connects
io.on('connection', socket => {
  // 有連線發生時增加人數
  onlineCount++;
  // 發送人數給網頁
  io.emit("online", onlineCount)

  socket.on('userOnline', () => {
    socket.emit('userOnline', 'Hi, User')
  })

  console.log('username', name)
  console.log('a user connected', socket.id)
  //Welcome current user
  socket.emit('message', 'Welcome to Chat')
  //broadcast when a user connects
  socket.broadcast.emit('message', 'A user has joined the chat')

  socket.on('chat-message', data => {
    io.sockets.emit('chat-message', data)
    console.log("chatroom 傳來的資訊 ", data)
  })

  //handle chat event
  socket.on('chat', data => {
    io.sockets.emit('chat', data);
  })

  // Runs when a user is typing
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data)
    console.log("typing", data)
  })

  //Runs when client disconnects
  socket.on('disconnect', () => {
    // 有人離線, 扣人數
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
    io.emit("online", onlineCount)
    io.emit('message', 'A user hase left the chat')
  });
})


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

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`))



require('./routes')(app, passport) // passport 傳入 routes


