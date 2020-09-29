const express = require('express')
const helpers = require('./_helpers');
const session = require('express-session')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


const handlebars = require('express-handlebars') // 引入 handlebars




const app = express()
const port = 3000




// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('handlebars', handlebars({
  defaultLayout: 'main'
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})
// app.use(passport.initialize())
app.use(passport.session())








app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// module.exports = app


// 引用路由器
require('./routes')(app)
