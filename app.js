const express = require('express')
const helpers = require('./_helpers');
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const flash = require('connect-flash')
const session = require('express-session')
const usePassport = require('./config/passport')
const methodOverride = require('method-override')

const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', hbs({ defaultLayout: 'main', extname: 'hbs', helpers: require('./config/hbs-helpers') }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
usePassport(app)
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})

require('./routes')(app)
