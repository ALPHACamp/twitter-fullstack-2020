if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers')
const exphbs = require('express-handlebars')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const flash = require('connect-flash')
// const helpers = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  next()
})

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(routes)

app.listen(port, () => console.log(`App is running on http://localhost:${port}`))

module.exports = app
