if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const helpers = require('./_helpers')

const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('./config/passport')

const handlebarsHelpers = require('./helpers/handlerbars-helpers')
const { pages, apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'simpleTwitter'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: true, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  // res.locals.user = getUser(req)
  next()
})

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use('/api', apis)
app.use(pages)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => {
  console.info(`Example app listening on http://localhost:${port}`)
})
module.exports = app
