const express = require('express')
const helpers = require('./_helpers')
const exhbs = require('express-handlebars')
const bodyPaser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('handlebars', exhbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({ secret: 'twittercat', resave: false, saveUninitialized: false }))
app.use(flash())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes/index')(app)
