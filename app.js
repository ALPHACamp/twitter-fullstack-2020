const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
