if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers');
const flash = require('connect-flash')
const session = require('express-session')
const routes = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
	res.locals.success_messages = req.flash('success_messages') 
	res.locals.error_messages = req.flash('error_messages')
	next()
})

const db = require('./models')
// setting static file
app.use(express.static('public'))
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
