const express = require('express')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} //有用到process.env.PORT的資料變數要放下面

const port = process.env.PORT //把PORT=3000放入.env
const baseURL = process.env.BASE_URL
const passport = require('./config/passport')

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./config/handlebars-helpers'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
)
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  res.locals.baseURL = baseURL
  console.log('res.locals.baseURL', res.locals.baseURL)
  next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

console.log('================')
console.log('進入app.js')

require('./routes')(app)

module.exports = app
