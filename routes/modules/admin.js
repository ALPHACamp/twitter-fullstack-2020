const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage) // 登入路由
router.get('/logout', adminController.logout) // 登出路由
router.get('/tweets', authenticatedAdmin, adminController.getTweets) // 後台清單列表路由
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet) //後台刪除tweet
router.get('/users', authenticatedAdmin , adminController.getUsers) // 後台使用者列表路由


module.exports = router