if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const methodOverride = require('method-override')
const handlebars = require('express-handlebars')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes')
const app = express()
const port = 3000 || process.env.PORT

const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.error_messages_account = req.flash('error_messages_account')
  res.locals.loginUser = helpers.getUser(req)
  next()
})

app.use(routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
