const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const session = require('express-session')
const flash = require('connect-flash')
const helpers = require('./_helpers');
const db = require('./models')

const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/hbs-helpers')
}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use(session({ secret: 'Minesecret', resave: false, saveUninitialized: false }))


app.use(passport.initialize())
app.use(passport.session())


app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)   //取代req.user
  next()
})




app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

require('./routes')(app, passport)

module.exports = app
