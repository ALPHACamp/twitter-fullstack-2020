const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const passport = require('./config/passport')
const helpers = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// TEMPLATE ENGINE
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')

// BODY PARSER
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// SESSION
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())

// FLASH MESSAGE
app.use(flash())

// METHOD OVERRIDE
app.use(methodOverride('_method'))

// STATIC FILE
app.use(express.static('public'))

// LOCAL PARAMS
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = helpers.getUser(req)
  next()
})

// ROUTES
require('./routes')(app, passport)

// listening
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

// for test automation
module.exports = app
