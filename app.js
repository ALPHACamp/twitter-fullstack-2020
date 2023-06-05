// modules
const express = require('express')
const app = express()
const handlebars = require('express-handlebars')

// files
const helpers = require('./_helpers')
const routes = require('./routes')
app.use(express.static('public'))

const port = 3000

app.engine('hbs', handlebars({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// routes
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// exports
module.exports = app
