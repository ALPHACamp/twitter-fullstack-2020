// 引入模組
const express = require('express')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
// 引入路由
const routes = require('./routes/index')
// 引入helper
const helpers = require('./_helpers')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const passport = require('./config/passport')
const SESSION_SECRET = 'secret'

// 建立app
const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// Handlebars 設定

app.engine('hbs', handlebars({ extname: '.hbs', defaultLayout: 'main', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    res.locals.warning_messages = req.flash('warning_messages')
    res.locals.notice_messages = req.flash('notice_messages')
    res.locals.user = getUser(req)
    next()
  })

// 使用路由器
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app