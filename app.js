const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')

const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const passport = require('./config/passport.js')
const helpers = require('./_helpers')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// TEMPLATE ENGINE
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'twitterSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static('public'))

// BODY PARSER
app.use(express.urlencoded({ extended: true }))

// SESSION
app.use(session({
  secret: 'SimpleTwitterSecret',
  resave: false,
  saveUninitialized: true
}))

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())

// FLASH MESSAGE
app.use(flash())

// LOCAL PARAMS
app.use((req, res, next) => {
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
  res.locals.user = helpers.getUser(req)
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

// METHOD OVERRIDE
app.use(methodOverride('_method'))

// ROUTES
require('./routes')(app, passport)

// listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// for test automation
module.exports = app
