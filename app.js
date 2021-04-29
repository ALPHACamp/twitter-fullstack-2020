if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const hbsHelpers = require('./config/handlebars-helper')
const exphbs = require('express-handlebars')
const { urlencoded, json } = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000

app.use('/upload', express.static(__dirname + '/upload'))

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: hbsHelpers }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(session({
  secret: 'YouWillNeverKnow',
  resave: false,
  saveUninitialized: false
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = helpers.getUser(req)
  res.locals.currentPath = req.path
  res.locals.userProfilePath = helpers.getUser(req) ? `/users/${helpers.getUser(req).id}/tweets` : ''
  next()
})
app.use(methodOverride('_method'))

require('./routes')(app, passport)

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
