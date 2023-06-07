const express = require('express')
const router = express.Router()
const passport = require('passport')

const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

const { authenticator } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/regist', userController.registPage)
router.post('/regist', userController.regist)
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
router.get('/logout', userController.logout)
router.get('/main', authenticator, tweetController.mainPage)
router.use('/', (req, res) => res.redirect('/main'))
router.use('/', generalErrorHandler)

module.exports = router
