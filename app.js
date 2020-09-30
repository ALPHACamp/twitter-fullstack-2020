const express = require('express')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')


const app = express()
const port = 3000

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(session({
  secret: 'my secret key',
  resave: false,
  saveUninitialized: false ,
}))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.failure_msg = req.flash('failure_msg')
  next()
})

require('./routes')(app, passport)

//app.get('/', (req, res) => res.render('index'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//module.exports = app
