const express = require('express')
const helpers = require('./_helpers')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const db = require('./models')

app.engine('hbs', handlebars.engine({ extname: '.hbs', helpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
// setting static file
app.use(express.static('public'))
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use(routes)

// app.get('/', (req, res) => res.send('Hello World!'))

// app.get('/twitter', twitterController.getTwitters)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
