const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const helpers = require('./_helpers');

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// 設定 view engine 使用 handlebars
app.engine('handlebars', handlebars({ 
    defaultLayout: 'main',
  })) 
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

// setup passport
app.use(passport.initialize())
app.use(passport.session())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    res.locals.user = helpers.getUser(req)
    next()
})

//method
app.use(methodOverride('_method'))

//image
app.use('/upload', express.static(__dirname + '/upload'))

// 跟資料庫同步
//app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
require('./routes')(app)
