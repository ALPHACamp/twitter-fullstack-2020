const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const helpers = require('./_helpers')
// const passport = require('./config/passport')
const routes = require('./routes')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.use(session({ secret: '12345678', resave: false, saveUninitialized: false }))
// app.use(passport.initialize())
// app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
