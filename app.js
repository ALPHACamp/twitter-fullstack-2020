const express = require('express')
const hbs = require('express-handlebars')
const db = require('./models')
const passport = require('./config/passport')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 8000

// set public file
app.use(express.static('public'))
// set handlebars
app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
let Appear = { navbar: false, top10: false }

app.get('/', (req, res) => res.render('admin/signin', { Appear, isAuthenticated: true }))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
