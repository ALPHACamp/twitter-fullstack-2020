// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

const passport = require('../config/passport')


// 準備引入路由模組


router.get('/', (req, res) => res.redirect('/tweets'))

router.get('/tweets', tweetController.getTweets)
router.get('/tweet', tweetController.getTweet)
router.get('/setting', userController.settingPage)

router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
router.get('/logout', userController.logout)

router.get('/register', userController.registerPage)
router.post('/register', userController.userRegister)


router.get('/admin/login', adminController.loginPage)
router.get('/admin/tweets', adminController.getTweets)
router.get('/admin/users', adminController.getUser)





// 匯出路由器
module.exports = router
