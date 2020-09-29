const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const db = require('./models')
const app = express()
const port = 3000
const passport = require('./config/passport')

const flash = require('connect-flash')
const session = require('express-session')

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

//pssport初始化與啟動session
app.use(passport.initialize())
app.use(passport.session())

// 把 req.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()



app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport) // passport 傳入 routes

module.exports = app
