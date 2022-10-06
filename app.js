const express = require('express')
const passport = require('./config/passport')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')

const session = require('express-session')

const app = express()
const port = process.env.PORT || 3000

const SESSION_SECRET = process.env.SESSION_SECRET || 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelper }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 error 訊息
  res.locals.error_messages = req.flash('warning_messages') // 設定 warning 訊息
  next()
})

// 設定共用檔案
app.use(express.static('public'))

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
