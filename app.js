const express = require('express')
const app = express()

const helpers = require('./_helpers')
const routers = require('./routes')

const port = 3000

const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('handlebars', handlebars({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.get('/', (req, res) => res.send('test'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

routers(app)

module.exports = app
