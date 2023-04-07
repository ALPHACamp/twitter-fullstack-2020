const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const adminController = require('../../controllers/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage) // 登入畫面
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn) // 登入路由
router.get('/logout', adminController.logout) // 登出路由
router.get('/tweets', authenticatedAdmin, adminController.getTweets) // 後台清單列表路由
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet) //後台刪除tweet
router.get('/users', authenticatedAdmin , adminController.getUsers) // 後台使用者列表路由


module.exports = router