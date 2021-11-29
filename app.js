const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers');

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars()) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('Hello World!'))


// 前台
app.get('/signin', (req, res) => {
    res.render('signin', {})
})

app.get('/signup', (req, res) => {
    res.render('signup', {})
})

app.post('/signup', (req, res) => {
    console.log(req.body)
    res.send(req.body)
})
// 後台
app.get('/admin/signin', (req, res) => {
    res.render('admin/signin', {})
})






app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
