const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

// 後台登入
router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureMessage: true }), adminController.signIn)

// 後台首頁
router.get('/tweets', authenticatedAdmin, adminController.adminGetTweets)
router.delete('/tweets/:tid', authenticatedAdmin, adminController.deleteUserTweet)
router.get('/users', authenticatedAdmin, adminController.adminGetUsers)

module.exports = router