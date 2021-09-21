const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const helpers = require('./_helpers')


const app = express()
const port = 3000

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.use(express.static('public'))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
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
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport)

module.exports = app
