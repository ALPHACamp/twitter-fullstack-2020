const express = require('express')
const Handlebars = require('handlebars')
const helpers = require('./_helpers')
const exphbs = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport)

module.exports = app
