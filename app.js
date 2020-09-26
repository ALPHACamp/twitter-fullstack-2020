const express = require('express')
const exphbs = require('express-handlebars')
const helpers = require('./_helpers');

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: "main", extname: "hbs" }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.use('/', (req, res) => {
  res.render('signin')
})
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => {
  res.render('tweets')
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
