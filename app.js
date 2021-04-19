const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const helpers = require('./_helpers');

const app = express()
const PORT = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'hbs') // 設定使用 Handlebars 做為樣板引擎, 使用縮寫hbs
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/users/login', (req, res) => {
    res.render('login')
})

app.post('/users/login', (req, res) => {
    res.send('login')
})

app.get('/users/register', (req, res) => {
    res.render('register')
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})

module.exports = app
