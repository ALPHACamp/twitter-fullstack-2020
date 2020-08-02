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
  }
]

const server = app.listen(PORT, () => console.log(`Alphitter is listening on port ${PORT}!`))
const io = socket(server)

io.on('connection', socket => {

  // 在線的使用者，一連線就加進onlineUsers陣列裡
  onlineUsers.push({ id, name, account, avatar })

  // server message
  socket.emit('message', `Hello, ${name}`)
  socket.broadcast.emit('message', `${name} join chatroom`)
  io.emit('onlineUsers', onlineUsers)

  // user message
  socket.on('chat', data => {
    io.emit('chat', formatMessage(name, data))
  })

  // listen typing
  socket.on('typing', data => {
    data.name = name
    socket.broadcast.emit('typing', data)
  })

  // user leave room
  socket.on('disconnect', () => {
    //過濾掉離線使用者，並傳值給前端
    onlineUsers = onlineUsers.filter((user, index, array) => {
      return user.id !== id
    })
    io.emit('onlineUsers', onlineUsers)
    socket.broadcast.emit('typing', { isExist: false })
    socket.broadcast.emit('message', `${name} left chatroom`)
  })

})

require('./routes/index')(app, passport)

module.exports = app