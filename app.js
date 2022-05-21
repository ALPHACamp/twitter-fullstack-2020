const express = require('express')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

const routes = require('./routes/index')
routes(app)
// require('./routes/index')(app)

module.exports = app
