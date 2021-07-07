const express = require('express')
const exphbs = require('express-handlebars')
const helpers = require('./_helpers')

const app = express()
const port = 3000

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helper')
}))
app.set('view engine', 'hbs')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

require('./routes/index')(app)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


module.exports = app
