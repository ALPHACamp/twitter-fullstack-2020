const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const helpers = require('./_helpers');

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

const app = express()
const port = 3000

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helper')
}))
app.set('view engine', 'hbs')

app.use(methodOverride('_method'))

require('./routes/index')(app)
// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


module.exports = app
