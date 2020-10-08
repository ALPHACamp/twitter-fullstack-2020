const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const app = express()
const db = require('./models')
const methodOverride = require('method-override')
const passport = require('./config/passport')

const flash = require('connect-flash')
const session = require('express-session')

app.use(bodyParser.urlencoded({ extended: true }))


app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')

app.use(methodOverride("_method"));

app.use('/upload', express.static(__dirname + '/upload'))


// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(methodOverride('_method'))


//pssport初始化與啟動session
app.use(passport.initialize())
app.use(passport.session())

// 把 req.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

//使用public 資料夾
app.use(express.static('public'))



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app, passport) // passport 傳入 routes


