if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const Message = db.Message
const User = db.User
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const PORT = process.env.PORT || 3000

const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const path = require('path')
const Handlebars = require('handlebars')
const helpers = require('./_helpers')
const socket = require('socket.io')
const moment = require('moment')

// This package can help you disable prototype checks for your models.
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

app.use(express.static('public'))

app.use('/upload', express.static(__dirname + '/upload'))

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: require('./config/handlebars-helpers'),  // add partial
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}))

app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

let loginID, loginName, loginAvatar, loginAccount

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)

  if (helpers.getUser(req)) {
    loginID = helpers.getUser(req).id
    loginName = helpers.getUser(req).name
    loginAvatar = helpers.getUser(req).avatar
    loginAccount = helpers.getUser(req).account
  }

  next()
})

let onlineUsers = []

const server = app.listen(PORT, () => console.log(`Express is listening on http://localhost:${PORT}`))
const io = socket(server)

io.on('connection', async socket => {
  console.log('a user connected!');

  // push user data to online user list
  onlineUsers.push({ loginID, loginName, loginAvatar, loginAccount })
  // record user info
  const loginUser = onlineUsers.find(user => user.loginID === loginID)

  // get history message
  let historyMessages
  await Message.findAll({
    include: [User],
    order: [['createdAt', 'ASC']]
  }).then(messages => {
    historyMessages = messages.map(item => ({
      text: item.dataValues.text,
      name: item.dataValues.User.name,
      avatar: item.dataValues.User.avatar,
      isLoginUser: loginUser.loginID === item.dataValues.User.id ? true : false,
      time: moment(item.dataValues.createdAt).format('LLL')
    }))
  })

  let users
  await User.findAll().then(results => {
    // console.log(results[0].dataValues)
    users = results.map(item => ({
      ...item.dataValues,
      account: item.dataValues.account,
      name: item.dataValues.name,
      avatar: item.dataValues.avatar,
    }))
  })



  // emit history message to user
  socket.emit('history', historyMessages)

  // broadcast online
  socket.broadcast.emit('message', `${loginUser.loginName} 上線`)

  // emit online user
  io.emit('onlineUsers', onlineUsers)

  socket.on("message", data => {
    console.log('send message')
    io.emit("message", 'data')
  })

  socket.on("connected", users => {
    console.log('send user')
    console.log('users:', users)

    io.emit("connected", users)
  })

  socket.on('disconnect', function () {
    console.log('a user go out')
    socket.broadcast.emit('message', `${loginUser.loginName} 離線`)

    // delete user date in online user list
    onlineUsers = onlineUsers.filter(user => user.loginID !== loginUser.loginID)
    socket.broadcast.emit('onlineUsers', onlineUsers)
  })

  // 接收 chat 發出的訊息
  socket.on('chat', async msg => {
    // console.log('測試能否抓到 chat 的訊息內容:', msg)
    // let receiverMessage
    await Message.create({
      UserId: loginUser.loginID,
      text: msg
    }).then((messages => {
      receiverMessage = {
        text: messages.dataValues.text,
        avatar: loginUser.loginAvatar,
        time: moment(messages.dataValues.createdAt).format('LLL')
      }
    }))
    socket.broadcast.emit('chat', receiverMessage)
  })
})


require('./routes')(app, passport)

module.exports = app