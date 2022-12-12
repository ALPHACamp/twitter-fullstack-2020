const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine('hbs', handlebars({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
