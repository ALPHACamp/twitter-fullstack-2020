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

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

passport(app)

app.use(flash())

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

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const io = socket(server)
// run with client connects
io.on('connection', socket => {
  // 有連線發生時增加人數
  onlineCount++
  // 發送人數給網頁
  io.emit('online', onlineCount)

  // online user list
  onlineUsers.push({ id, name, account, avatar })
  const set = new Set()
  onlineUsers = onlineUsers.filter((item) =>
    !set.has(item.id) ? set.add(item.id) : false
  )
  const user = onlineUsers.find((user) => user.id === id)
  user.current = true

  // online users
  io.emit('onlinePPL', onlineUsers)
})

routers(app)

module.exports = app
