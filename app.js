// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars') 
const flash = require('connect-flash')
const session = require('express-session')
const helpers = require('./_helpers');
const routes = require('./routes')
const app = express()

const port =  process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')  // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages')  // 設定 warning_msg 訊息
  next()
})

app.use(routes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})

module.exports = app
