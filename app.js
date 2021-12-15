const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers');
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const db = require('./models')
const User = db.User
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
app.use('/upload', express.static(__dirname + '/upload'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers')
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())


app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    res.locals.user = req.user
    next()
})




require('./routes')(app, passport)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


module.exports = app