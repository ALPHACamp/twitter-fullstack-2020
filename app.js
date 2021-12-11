const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000

// 設定 view engine 使用 handlebars
app.engine(
  'hbs',
  handlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require('./config/handlebars-helpers'),
  })
)
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})
app.use(methodOverride('_method'))

app.listen(port, () => {
  console.log(`Simple-Twitter app listening on port ${port}!`)
})

require('./routes')(app, passport)

module.exports = app
