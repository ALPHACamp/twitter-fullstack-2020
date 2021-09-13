const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const helpers = require('./_helpers');

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


require('./routes')(app)

module.exports = app
