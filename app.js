const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')

const session = require('express-session')
const methodOverride = require('method-override')
const helpers = require('./_helpers');

const app = express()
const port = process.env.PORT || 3000

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { cors: { origin: "*" } })
const messageController = require('./controllers/messageController')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')

app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.static(__dirname + '/public'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

// 在線使用者的空陣列容器
let onlineUser = []

io.on('connection', (socket) => {
  socket.on('send user', function (currentName, currentAccount, currentAvatar, currentId) {
    // 上線 - 新增使用者至名單
    socket.broadcast.emit('new user msg', currentName, currentAccount, currentAvatar, currentId)
    onlineUser.push({ currentName, currentAccount, currentAvatar, currentId })

    socket.on('chat message', (msg, currentId, currentAvatar) => {
      const user = { id: currentId, msg: msg }
      messageController.sendMsg(user)
      io.emit('chat message', msg, currentId, currentAvatar)
      socket.broadcast.emit('noteEveryOne')
    })


    socket.on('disconnect', () => {
      // 下線 - 將該使用者從名單中移除
      const remove = { currentName, currentAccount, currentAvatar }
      onlineUser = onlineUser.filter(item => {
        return item.currentAccount !== remove.currentAccount
      })
      socket.broadcast.emit('user offline', currentName)
      io.emit('online user', onlineUser)
    })
  })

  socket.on('onlineUser', () => {
    io.emit('online user', onlineUser)
  })

})

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  res.locals.url = req.url
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app