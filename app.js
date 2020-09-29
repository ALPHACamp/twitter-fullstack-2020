const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars') // 引入 handlebars

const app = express()
const port = 3000




// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine('handlebars', handlebars({
  defaultLayout: 'main'
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.get('/', (req, res) => res.render('main'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// module.exports = app


// 引用路由器
require('./routes')(app)
