const express = require('express')
const handlebars = require('express-handlebars')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const pages = require('./routes')
const helpers = require('./_helpers')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
// app.get('/', (req, res) => res.send('Hello World!'))

app.use(pages)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
