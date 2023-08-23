// 引入模組
const express = require('express')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')

// 引入路由
const routes = require('./routes/index')
// 引入helper
const helpers = require('./_helpers');

// 建立app
const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// Handlebars 設定
app.engine('hbs', handlebars({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

// 使用路由器
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
