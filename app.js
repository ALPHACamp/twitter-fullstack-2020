const express = require('express')
const helpers = require('./_helpers')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const flash = require('connect-flash')
const session = require('express-session')
const db = require('./models')
const passport = require('./config/passport')
const methodOverride = require('method-override')
// const moment = require('moment')

// const exhbs = require('express-handlebars')
// const bodyParser = require('body-parser')
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./config/handlebars-helpers'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
)
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(methodOverride('_method'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
