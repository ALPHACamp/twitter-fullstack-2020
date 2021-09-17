const express = require('express')
const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const helpers = require('./_helpers')
const routes = require('./routes')
const session = require('express-session')
const passport = require('./config/passport')
// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exhbs({ defaultLayout: 'main', extname: 'hbs', helpers: require('./config/handlebars-helper') }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'simpleTweetSecret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user
  next()
})
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


app.use(routes)

module.exports = app