const express = require('express')
const helpers = require('./_helpers')
const exphbs = require('express-handlebars')
const handlebarsHelpers = require('./helpers/handlebarsHelpers') 


const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' , helpers: handlebarsHelpers}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.render('following'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
