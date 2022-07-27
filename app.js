const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const helpers = require('./_helpers')
const routes = require('./routes')

const app = express()
const port = 3000
const SESSION_SECRET = 'secret'

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
