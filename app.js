const express = require('express')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const {
  allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access')
const helpers = require('./_helpers')
const app = express()

//user to chat feature
const http = require('http');
const server = http.createServer(app);  //用在server.listener&帶入參數
const socketChat = require('./config/socketChat')  


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} //有用到process.env.PORT的資料變數要放下面

const PORT = process.env.PORT //把PORT=3000放入.env
const baseURL = process.env.BASE_URL
const passport = require('./config/passport')

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./config/handlebars-helpers'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
)
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  res.locals.baseURL = baseURL
  next()
})

server.listen(PORT, () => console.log(`Example app listening on http://localhost:${PORT}!`))


require('./routes')(app)

socketChat.Server(server) //server參數傳遞給io instance使用 建立通道
socketChat.connect()  //與前端通道連線

module.exports = app
