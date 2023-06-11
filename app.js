// modules
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

// files
const helpers = require('./_helpers')
const routes = require('./routes')
app.use(express.static('public'))

const port = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET || 'simple_twitter_session_secret'

app.engine('hbs', handlebars({ extname: '.hbs', defaultLayout: 'main', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  // 為了不跟user的資料衝突，所以更換名字
  res.locals.loginUser = helpers.getUser(req)
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req)
  next()
})

// routes
app.use(routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// exports
module.exports = app
