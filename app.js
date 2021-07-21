if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const helpers = require('./_helpers');
const passport = require('./config/passport')
const db = require('./models') // 引入資料庫

const app = express()
const port = process.env.PORT

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helper')
}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

// 確保 socket 判斷當下登入使用者之變數
let id, name, account, avatar
app.use((req, res, next) => {
  if (helpers.getUser(req)) {
    ({ id, name, account, avatar } = helpers.getUser(req))
  }
  next()
})

require('./routes')(app, passport)
const server = app.listen(Number(port), () => {
  console.log(`Example app listening at http://localhost:3000`)
})

/*********************************** 
    Socket portion
************************************/
const io = require('socket.io')(server)
const { Message } = db
let onlineCount = 0
let onlineUsers = []
io.on('connection', (socket) => {
  console.log('建立連線成功')
  // 當連線成功, 添加連線數量, 發送上線人數更新
  onlineCount++
  io.emit('onlineCount', onlineCount)

  if (id) {
    onlineUsers.push({ id, name, account, avatar })
  }
  const set = new Set()
  // 若 user.id 沒出現過 set 中, 將 user.id 推入 set 中, 後續若有重複 user.id, 會被 filter 略過
  onlineUsers = onlineUsers.filter(user =>
    !set.has(user.id) ? set.add(user.id) : false)
  console.log('==============================================') // 除錯用分隔線
  // // 使用者清單中, 抓取當前登入者
  const localUser = onlineUsers.find(user => user.id === id)

  // 發送所有上線使用者清單
  io.emit('onlineUsers', onlineUsers)

  // 廣播 通知所有人 有 使用者 上線
  socket.broadcast.emit('broadcast', `${localUser.name} 加入聊天室`)


  socket.on('disconnect', () => {
    console.log('斷線')
    // 更新連線人數
    onlineCount--
    io.emit('onlineCount', onlineCount)
    // 從上線清單移除當前登入者, 更新上線清單
    onlineUsers = onlineUsers.filter(user => user.id !== localUser.id)
    io.emit('onlineUsers', onlineUsers)
    socket.broadcast.emit('broadcast', `${localUser.name} 離開聊天室`)
  })

  // 收到發留言事件, 儲存消息, 並推送到前端去更新留言
  socket.on('chat message', data => {
    // 儲存到 Message DB
    Message.create({
      UserId: data.id,
      message: data.msg
    })
    // 傳送到前端, 刷新留言
    io.emit('chat message', { msg: data.msg, id: localUser.id, name: localUser.name, account: localUser.account, avatar: localUser.avatar, createdAt: new Date() })
  })
})


module.exports = app