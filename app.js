const express = require('express')
const helpers = require('./_helpers');
const hbs = require('express-handlebars')
const app = express()
const port = 3000

// set public file
app.use(express.static('public'))
// set handlebars
app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs'
}))
app.set('view engine', 'hbs')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.render('admin/signin', {isAuthenticated: true}))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
