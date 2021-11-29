const express = require('express')
const handlebars = require('express-handlebars')
const helpers = require('./_helpers');

const app = express()
const port = 3000
const db = require('./models')
const User = db.User
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const session = require('express-session')
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars()) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    next()
})

app.get('/', (req, res) => res.send('Hello World!'))


// 前台
app.get('/signin', (req, res) => {
    res.render('signin', {})
})

app.get('/signup', (req, res) => {
    res.render('signup', {})
})

app.post('/signup', (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
        req.flash('error_messages', '兩次密碼輸入不同！')
        return res.redirect('/signup')
    } else {
        User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) {
                req.flash('error_messages', '信箱重複！')
                return res.redirect('/signup')
            } else {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                }).then(user => {
                    req.flash('success_messages', '成功註冊帳號！')
                    return res.redirect('/signin')
                })
            }
        })
    }
})
// 後台
app.get('/admin/signin', (req, res) => {
    res.render('admin/signin', {})
})






app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
