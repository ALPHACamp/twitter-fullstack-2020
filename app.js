const helpers = require('./_helpers')
const express = require('express')
const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')


const app = express()
const port = 3000

app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())



app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

const routes = require('./routes')
app.use(routes)
// require('./routes')(app)

module.exports = app
