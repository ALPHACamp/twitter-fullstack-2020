const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))


app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    next()
  })


app.engine('handlebars', handlebars({defaultLayout: 'main'})) 
app.set('view engine', 'handlebars') 

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.render('signin'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



// module.exports = app
require('./routes')(app)
