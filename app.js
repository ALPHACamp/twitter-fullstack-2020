const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars') // 引入 handlebars
const app = express()
const port = 3000

app.engine('handlebars', handlebars({defaultLayout: 'main'})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定Handlebars 做為樣板引擎
app.use(express.static('public'))


// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
