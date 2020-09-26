const express = require('express')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: "main", extname: "hbs" }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.use('/', (req, res) => {
  res.render('test')
})
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
