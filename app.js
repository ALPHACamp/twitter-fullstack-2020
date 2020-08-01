// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const express = require('express')
const exhbs = require('express-handlebars')
const bodyPaser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const middleware = require('./config/middleware')
const helpers = require('./_helpers')
const socket = require('socket.io')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('handlebars', exhbs({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({ secret: 'twittercat', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(middleware.topUsers)
app.use(middleware.setLocals)

const server = app.listen(PORT, () => console.log(`Alphitter is listening on port ${PORT}!`))
const io = socket(server)

let username = ''
app.use((req, res, next) => {
  if (helpers.getUser(req)) {
    username = helpers.getUser(req).name
  }
  next()
})

io.on('connection', socket => {
  const members = {}
  const socketId = socket.id
  const userChatName = username

  // server message
  socket.emit('message', `${username}Welcome to AlphaChatRoom`)
  socket.broadcast.emit('message', `${username} join chatroom`)

  // user message
  socket.on('chat', data => {
    //傳入data物件裡  userChatName: xxx
    data.userChatName = userChatName
    io.emit('chat', data)
  })

  socket.on('typing', data => {
    data.userChatName = userChatName
    socket.broadcast.emit('typing', data)
  })

  // onlineuser
  socket.on('onlineUser', () => {
    io.emit('onlineUser', members)
  })

  // user leave room
  socket.on('disconnect', () => {
    socket.broadcast.emit('typing', { isExist: false })

    socket.broadcast.emit('message', `${username} left chatroom`)
  })

})

require('./routes/index')(app, passport)

module.exports = app