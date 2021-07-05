const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers');
const db = require('./models') // 引入資料庫
const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('hbs', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'hbs')

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

require('./routes')(app)

module.exports = app
