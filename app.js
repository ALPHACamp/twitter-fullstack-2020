const express = require('express')
const exphbs = require('express-handlebars')
const routes = require('./routes')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true })) // body-Parser
app.use(methodOverride('_method')) // methodOverride

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
