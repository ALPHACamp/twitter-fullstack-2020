const express = require('express')
const handlebars = require('express-handlebars')

const helpers = require('./_helpers')
const { pages } = require('./routes')

const app = express()
const port = 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(pages)

app.listen(port, () => {
  console.info(`Example app listening on http://localhost:${port}`)
})

module.exports = app
