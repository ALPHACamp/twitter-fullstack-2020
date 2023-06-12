if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers');
const passport = require('./config/passport')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 3000

const handlebarsHelper = require('./helpers/handlebars-helper')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// Setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: handlebarsHelper }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }))
// secret寫死? 加進env?

// setting body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// passport setting
app.use(passport.initialize())
app.use(passport.session())

// setting method-override
app.use(methodOverride('_method'))

// Setting middleware
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.danger_msg = req.flash('danger_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.info_msg = req.flash('info_msg')
  res.locals.loginUser = helpers.getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
