const express = require('express')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routers = require('./routes')

const port = process.env.PORT || 3000

const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const helpers = require('./_helpers')
const socket = require('socket.io')
const message = require('./public/javascript/message')

app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))

passport(app)
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})
// chatroom
let loginId, loginName, loginAccount, loginAvatar

app.use((req, res, next) => {
  if (helpers.getUser(req)) {
    ({ loginId, loginName, loginAccount, loginAvatar } = helpers.getUser(req))
  }
  next()
})
let onlineUsers = []
let onlineCount = 0

const io = socket(server)
// run with client connects
io.on('connection', socket => {
  // 有連線發生時增加人數
  onlineCount++
  // 傳送人數給網頁
  io.emit('online', onlineCount)

  // online user list
  onlineUsers.push({ loginId, loginName, loginAccount, loginAvatar })
  const set = new Set()
  onlineUsers = onlineUsers.filter((item) =>
    !set.has(item.id) ? set.add(item.id) : false
  )
  const user = onlineUsers.find((user) => user.id === loginId)
  user.current = true

  // online users
  io.emit('onlineUser', onlineUsers)

  // Welcome current user
  socket.emit('message', message(' ', 'Welcome to chatroom!'))

  // broadcast when user connects
  socket.broadcast.emit('message', message(user.name, ' has joined the chat'))

  // Runs when client disconnects
  socket.on('disconnect', () => {
    // 有人離線, 扣人數
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
    io.emit('online', onlineCount)
    io.emit('onlineUser', onlineUsers)

    io.emit('message', message(user.name, ' has left the chat'))
  })

  socket.on('chat-message', data => {
    io.sockets.emit('chat-message', data)
    console.log('chatroom client 傳來的資訊 ', data) // {message: , avatar, name}
  })

  // handle chat event
  socket.on('chat', data => {
    io.sockets.emit('chat', data)
  })

  // Runs when a user is typing
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data)
  })

  console.log('user', onlineUsers)
})

routers(app)

module.exports = app
