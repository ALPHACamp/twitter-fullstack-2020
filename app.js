const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

// 設定共用檔案
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
