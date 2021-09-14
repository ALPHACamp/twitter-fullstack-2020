const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const flash = require('connect-flash') //  自訂訊息並存到 session 裡
const session = require('express-session') 
const passport = require('./config/passport')
const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', handlebars({ defaultLayout: 'main' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定Handlebars 做為樣板引擎
app.use(express.static('public'))
// setup session 
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
// 初始化 Passport
app.use(passport.initialize())
// 啟動 session 功能，要放在 session() 之後
app.use(passport.session())
// setup flash
app.use(flash())
// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport) // 把 passport 傳入 routes

module.exports = app
