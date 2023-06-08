// 如果環境名不是production就引入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars')
const hbshelpers = require('./helpers/handlebars-helpers')
<<<<<<< HEAD

=======
>>>>>>> master
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const path = require('path')
const passport = require('./config/passport')
const helpers = require('./_helpers')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: hbshelpers
}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  // use helpers.getUser(req) to replace req.user
  res.locals.loginUser = helpers.getUser(req)
  next()
})
app.use(passport.initialize())
app.use(passport.session())
app.use(routes)

app.listen(port, () => { console.log(`Example app listening on port ${port}!`) })

module.exports = app
