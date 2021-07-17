const express = require('express')
const helpers = require('./_helpers')
const app = express()
const port = process.env.PORT || 3000

const flash = require('connect-flash')
const session = require('express-session')
const db = require('./models') // 引入資料庫
const passport = require('./config/passport')
const methodOverride = require('method-override')


const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})



app.engine('hbs', exhbs({ defaultLayout: 'main', extname: 'hbs', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.use(methodOverride('_method'))

app.use('/upload', express.static(__dirname + '/upload'))


require('./routes')(app, passport)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
