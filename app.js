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
  socket.on('chat message', async (msgObj) => {
    //當有人上線的時候
    if (msgObj.behavior === 'inout' && msgObj.message === 'is entering') {
      // 綁定 socket 和 name，為了待會辨識是誰離開
      socket.senderId = msgObj.senderId
      socket.senderName = msgObj.senderName

      // 打包屬於這個人需要的歷史訊息
      const chats = await Chat.findAll({
        raw: true,
        nest: true,
        order: [['createdAt']],
        include: [User],
        where: { createdAt: { $lt: msgObj.createdAt } }
      })

      // 將歷史詢息傳送給剛上線的那個人
      io.emit(`history-${msgObj.senderId}`, chats)

      // 將 「xxx 上線」的訊息廣播到每個人的聊天室
      io.emit('chat message', msgObj)

      // 將「xxx 上線」的這個訊息，寫入資料庫 User --> status
      const user = await User.findByPk(msgObj.senderId)
      await user.update({ status: 'online' })

      // 推播「xxx 上線」的資訊到每一個人的「誰上線中」頁面
      const users = await User.findAll({
        raw: true,
        nest: true,
        where: { status: 'online' }
      })
      io.emit('online-users', users)
      // console.log('into app.js/line89...users', users)
    }

    // 當收到一般上線的人在聊天室裡講話
    if (msgObj.behavior === 'live-talk') {

      // 進行廣播，並存到資料庫      
      io.emit('chat message', msgObj)
      await Chat.create({
        UserId: msgObj.senderId,
        channel: 'chat message',
        behavior: 'live-talk',
        message: msgObj.message
      })
    }
  })
  socket.on('disconnect', async () => {
    //當有人離線的時候，廣播所有聊天室的人
    io.emit('chat message', {
      behavior: 'inout',
      message: 'has left',
      senderName: socket.senderName
    })

    // 將「xxx 離線」的這個訊息，寫入資料庫 User --> status
    const user = await User.findByPk(socket.senderId)
    await user.update({ status: 'offline' })

    // 推播更新後的「xxx 上線」的資訊到每一個人的「誰上線中」頁面
    const users = await User.findAll({
      raw: true,
      nest: true,
      where: { status: 'online' }
    })
    io.emit('online-users', users)
  })
})

server.listen(3000, () => {
  console.log('socket listening on port 3000')
})


module.exports = app
