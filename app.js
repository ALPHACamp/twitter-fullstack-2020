const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('./config/passport')
const flash = require('connect-flash')
const methodOverride = require('method-override')
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

const app = express()
const port = process.env.PORT || 3000

app.engine('.hbs', exphbs({ 
  extname: '.hbs', 
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', '.hbs')

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

app.listen(port, () => console.log(`App listening on port ${port}!`))

require('./routes')(app, passport)