const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const tweetController = require ('../controllers/tweet-controller')

const admin = require('./modules/admin')
router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)

router.get('/tweets', tweetController.getTweets)

router.get("/users",userController.getUser) // 個人頁面測試用畫面 路由先不加:id
router.get('/users/:id/setting', userController.getSetting)

module.exports = router