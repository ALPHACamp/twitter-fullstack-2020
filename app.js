const express = require('express')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.render('index'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
