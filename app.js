const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers')
const A = '10000000'


const A = 10

const app = express()
const port = 3000

app.engine('handlebars', handlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use((req, res, next) => {
  // res.locals.success_messages = req.flash('success_messages')
  // res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.render('twitter'))
app.listen(4000, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
