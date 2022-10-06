const express = require('express')

const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')

const helpers = require('./_helpers')
const handlebarsHelper = require('./helpers/handlebars-helper')

const app = express()
const port = process.env.PORT || 3000

const SESSION_SECRET = process.env.SESSION_SECRET || 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelper }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

// 設定共用檔案
app.use(express.static('public'))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.warning_messages = req.flash('warning_messages')
  next()
})
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
