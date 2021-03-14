const express = require('express')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routers = require('./routes')

const port = process.env.PORT || 3000

const db = require('./models')
const Public = db.Public
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const helpers = require('./_helpers')
const socket = require('socket.io')
const formatMessage = require('./public/javascript/message')

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
let id, name, account, avatar

app.use((req, res, next) => {
  if (helpers.getUser(req)) {
    ({ id, name, account, avatar } = helpers.getUser(req))
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
  onlineUsers.push({ id, name, account, avatar })
  const set = new Set()
  onlineUsers = onlineUsers.filter(item =>
    !set.has(item.id) ? set.add(item.id) : false
  )
  // get currentUser user
  const user = onlineUsers.find(user => user.id === id)
  user.currentUser = true

  // online users
  io.emit('onlineUsers', onlineUsers)

  // server message
  socket.emit('message', `Hello, ${user.name}`)
  socket.broadcast.emit('message', `${user.name} joined this chatroom`)

  // Runs when client disconnects
  socket.on('disconnect', () => {
    onlineCount--
    io.emit('online', onlineCount)
    onlineUsers = onlineUsers.filter(user => user.id !== id)
    io.emit('onlineUsers', onlineUsers)
    socket.broadcast.emit('typing', { isExist: false })
    socket.broadcast.emit('message', `${user.name} left this chatroom`)
  })

  // handle chat event
  socket.on('chat', data => {
    Public.create({ message: data, UserId: user.id })
    io.emit('chat', formatMessage(user.name, data, user.avatar, user.currentUser))
  })

  // Runs when a user is typing
  socket.on('typing', data => {
    data.name = user.name
    socket.broadcast.emit('typing', data)
  })

  console.log('user', onlineUsers)
})

routers(app)

module.exports = app
