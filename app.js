const express = require('express')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')
const flash = require('connect-flash')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// Setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => res.render('example'))
app.get('/signup', (req, res) => {
  req.flash('danger_msg', 'error')
  res.render('signup')
})

// Setting flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.danger_msg = req.flash('danger_msg')
  next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
