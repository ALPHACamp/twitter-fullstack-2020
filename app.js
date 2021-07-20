const express = require('express')
const helpers = require('./_helpers')
const app = express()
const port = process.env.PORT || 3000

const flash = require('connect-flash')
const session = require('express-session')
const db = require('./models') // 引入資料庫
const passport = require('./config/passport')
const methodOverride = require('method-override')




const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})



app.engine('hbs', exhbs({ defaultLayout: 'main', extname: 'hbs', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.use(methodOverride('_method'))

app.use('/upload', express.static(__dirname + '/upload'))


require('./routes')(app, passport)


// socket.io
const httpServer = require("http").createServer(app);
const options = { /* ... */ };
const io = require("socket.io")(httpServer, options);
let userArray = []
let userId = ''
io.on("connection", socket => {
  console.log('客戶端成功連線服務器: ' + socket.id)

  // 由前端發送到後端的事件
  socket.on('login', userData => {
    console.log(userData)
    userData.socketId = socket.id
    // 發送資料給所有使用者
    userArray.push(userData)
    userId = userData.userId
    io.emit('onlineUser', { user: userArray })
    io.emit('newUserLogin', { userData })
  });


  // 斷開連接的操作
  socket.on('disconnect', () => {
    // 登出人資料傳到前端
    const logout = userArray.filter(user => {
      return user.socketId === socket.id
    })
    io.emit('logoutUser', { logout })

    // 登出後更新上線使用者
    userArray = userArray.filter(item => {
      console.log(item.socketId)
      return item.socketId !== socket.id
    })
    io.emit('onlineUser', { user: userArray })

  });



});

httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
