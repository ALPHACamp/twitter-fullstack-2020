const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const routes = require('./routes')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')
const methodOverride = require('method-override') 

const app = express()
const port = 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.use(methodOverride('_method'))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')  
  res.locals.error_messages = req.flash('error_messages')  
  next()
})

app.use(routes)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
