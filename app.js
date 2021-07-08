const express = require('express')
const handlebars = require('express-handlebars')

const helpers = require('./_helpers')
const db = require('./models')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const session = require('express-session')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = process.env.PORT || 3000


app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/hbs-helpers') }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(session({
  secret: process.env.SESSION_SECRET || 'ssseeecccrrreett',
  resave: false,
  saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

require('./routes')(app, passport)

module.exports = app
