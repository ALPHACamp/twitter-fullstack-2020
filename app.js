const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
// const helpers = require('./_helpers')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(methodOverride('_method'))
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
