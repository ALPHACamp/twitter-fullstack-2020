const express = require('express')
const helpers = require('./_helpers')
const methodOverride = require('method-override')
const handlebars = require('express-handlebars')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const session = require('express-session')
const passport = require('./config/passport')
const flash = require('connect-flash')
const routes = require('./routes')
// const { getUser } = require('./controllers/user-controller')
const app = express()
const port = process.env.PORT || 3000

const SESSION_SECRET = process.env.SESSION_SECRET || 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public')) // 設定共用檔案
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 error 訊息
  res.locals.warning_messages = req.flash('warning_messages') // 設定 warning 訊息
  res.locals.user = helpers.getUser(req) // 設定currentUser讓view直接抓現在登入的使用者狀態
  next()
})

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
