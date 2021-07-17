const express = require('express')
const hbs = require('express-handlebars')
const db = require('./models')
const passport = require('./config/passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const moment = require('moment')

const helpers = require('./_helpers')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const PORT = process.env.PORT || 8000

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

//set .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// set public file
app.use(express.static('public'))
// set handlebars
app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

//for mocha test's
app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

require('./routes')(app)

// socket.io

const { User, Chat } = require('./models')

io.on('connection', (socket) => {
  // console.log('server - into app.js/line61...user connect, socket.id', socket.id)
  socket.on('chat message', async (msgObj) => {

    //當有人上線的時候
    if (msgObj.behavior === 'inout' && msgObj.message === 'is entering') {
      // console.log(`${msgObj.senderName} is registering`)
      // 綁定 socket 和 name，為了待會辨識是誰離開
      socket.senderName = msgObj.senderName
      const chats = await Chat.findAll({
        raw: true,
        nest: true,
        order: [['createdAt']],
        include: [User],
        where: {
          createdAt: {
            $lt: msgObj.createdAt
          }
        }
      })
      io.emit(`history-${msgObj.senderId}`, chats)
      // console.log('into app.js/line76...chats', chats)
    }
    if (msgObj.behavior === 'live-talk') {
      io.emit('chat message', msgObj)
      await Chat.create({
        UserId: msgObj.senderId,
        channel: 'chat message',
        behavior: 'live-talk',
        message: msgObj.message
      })
      // console.log('server line93...forward out...msgObj', msgObj)
    }
  })
  socket.on('disconnect', () => {
    // console.log('into app.js/line82...socket.senderName', socket.senderName)
    io.emit('chat message', {
      behavior: 'inout',
      message: 'has left',
      senderName: socket.senderName
    })
  })
})

server.listen(3000, () => {
  console.log('socket listening on port 3000')
})


module.exports = app
