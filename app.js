const express = require('express')
const helpers = require('./_helpers')
const app = express()
const port = 3000
const db = require('./models') // 引入資料庫


const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
const passport = require('passport')


app.engine('hbs', exhbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()




require('./routes')(app, passport)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
