// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 準備引入路由模組
router.get('/', (req, res) => res.send('Hello World!'))

router.get('/users/login', (req, res) => {
    res.render('login')
})

router.post('/users/login', (req, res) => {
    res.send('login')
})

router.get('/users/register', (req, res) => {
    res.render('register')
})

// 匯出路由器
module.exports = router
