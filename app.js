const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const app = express()
const port = 3000

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
