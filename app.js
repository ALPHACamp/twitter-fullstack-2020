const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const helpers = require('./_helpers');
const { urlencoded } = require('body-parser');

const app = express()
const port = 3000
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser, urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
