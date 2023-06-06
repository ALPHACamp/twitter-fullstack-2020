const express = require('express')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')

const router = require('./routes')
const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// Setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }))

// Setting middleware
app.use(flash())
app.use((req, res, next) => {
  res.locals.danger_msg = req.flash('danger_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.info_msg = req.flash('info_msg')
  next()
})

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
