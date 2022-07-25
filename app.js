if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const path = require('path')
const { engine } = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { pages, apis } = require('./routes')

const SESSION_SECRET = process.env.SESSION_SECRET

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

require('./models/index')

app.engine('handlebars', engine({ defaultLayout: 'main', helpers: handlebarsHelpers }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', apis)
app.use(pages)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
