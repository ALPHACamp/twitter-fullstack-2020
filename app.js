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
const { formatMessage } = require('./chat')

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

let id, name, account, avatar

app.use((req, res, next) => {
  if (helpers.getUser(req)) {
    ({ id, name, account, avatar } = helpers.getUser(req))
  }
  next()
})

// fake test
let onlineUsers = [
  {
    id: 5,
    name: 'chen',
    account: 'chenacccount',
    avatar: ''
  },
  {
    id: 8,
    name: 'carey',
    account: 'schiaaaa',
    avatar: ''
  },
  {
    id: 20,
    name: 'lala',
    account: 'lalawang',
    avatar: ''
  },
  {
    id: 8,  //測試重複
    name: 'bot',
    account: 'chatbot',
    avatar: ''
  }
]

const server = app.listen(PORT, () => console.log(`Alphitter is listening on port ${PORT}!`))
const io = socket(server)

io.on('connection', socket => {
  // enter chat room push user data to onlineUsers and filter repeat
  onlineUsers.push({ id, name, account, avatar })
  let set = new Set()
  onlineUsers = onlineUsers.filter(item => !set.has(item.id) ? set.add(item.id) : false)

  // get current user
  const user = onlineUsers.find(user => user.id === id)
  user.currentUser = true

  // server message
  socket.emit('message', `Hello, ${user.name}`)
  socket.broadcast.emit('message', `${user.name} join chatroom`)

  // update online users
  io.emit('onlineUsers', onlineUsers)

  // user emit message to all user 
  socket.on('chat', data => {
    io.emit('chat', formatMessage(user.name, data, user.avatar, user.currentUser))
  })

  // listen typing
  socket.on('typing', data => {
    data.name = user.name
    socket.broadcast.emit('typing', data)
  })

  // user leave room, reset onlineUsers
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.id !== id)
    io.emit('onlineUsers', onlineUsers)
    socket.broadcast.emit('typing', { isExist: false })
    socket.broadcast.emit('message', `${user.name} left chatroom`)
  })

})

require('./routes/index')(app, passport)

module.exports = app