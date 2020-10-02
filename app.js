const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const path = require('path')
const Handlebars = require('handlebars')

app.use(express.static('public'))

app.use('/upload', express.static(__dirname + '/upload'))


app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: require('./config/handlebars-helpers')  // add partial
}))

app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  // console.log(req.user)
  next()
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})

require('./routes')(app, passport)