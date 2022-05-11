const express = require('express')
const routes = require('./routes')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')
const methodOverride = require('method-override') 

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.use(methodOverride('_method'))

app.use(routes)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
