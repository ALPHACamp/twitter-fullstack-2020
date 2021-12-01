const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers');

const app = express()
const port = 3000
const db = require('./models')
const User = db.User
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const session = require('express-session')


app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars()) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
const passport = require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())







require('./routes')(app)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


module.exports = app