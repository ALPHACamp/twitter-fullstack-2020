if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')

const handlebarsHelpers = require('./helpers/handlebars-helpers')
const passport = require('./config/passport')
const routes = require('./routes')
const app = express()
const port = 3000
const SESSION_SECRET = 'secret'



// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine('hbs', handlebars({ defaultLayout: 'main', extname: 'hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => { console.log(`Example app listening on port ${port}!`) })

module.exports = app
