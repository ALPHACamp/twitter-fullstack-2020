const express = require('express')
const app = express()
const server = require('http').createServer(app)
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const helpers = require('./_helpers')
const useSocketIO = require('./config/socketIO')
const passport = require('./config/passport')
const useHbsHelper = require('./config/hbs-helpers')
const useRoutes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { PORT } = process.env

app.engine('hbs', hbs({ defaultLayout: 'main', extname: 'hbs', helpers: useHbsHelper }))
app.set('view engine', 'hbs')
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
useSocketIO(server)
app.use((req, res, next) => {
  res.locals.isAuth = helpers.ensureAuthenticated(req)
  res.locals.user = helpers.getUser(req)
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})
// 顯示上傳的圖片
app.use('/upload', express.static(__dirname + '/upload'))

server.listen(PORT, () => console.log(`The server is running on http://localhost:${PORT}`))

useRoutes(app)

module.exports = app
