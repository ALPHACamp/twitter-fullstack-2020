const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers')

const app = express()
const port = process.env.Port || 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine('hbs', handlebars({ extname: '.hbs' }))

app.set('view engine', 'hbs')
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
