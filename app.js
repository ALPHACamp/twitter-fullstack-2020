// 如果環境名不是production就引入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const handlebars = require('express-handlebars')
const hbshelpers = require('./helpers/handlebars-helpers')
const session = require('express-session')

const passport = require('./config/passport')
const helpers = require('./_helpers')
const routes = require('./routes')
const app = express()
const port = process.env.PORT
app.use(express.static('public'))
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: hbshelpers
}))
app.set('view engine', 'hbs')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(routes)

app.listen(port, () => { console.log(`Example app listening on port ${port}!`) })

module.exports = app
