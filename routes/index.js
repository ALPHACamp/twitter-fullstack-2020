const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/users/:id/edit', userController.editUser)
router.get('/users/:id/tweets', userController.getUserTweets)

// authenticated還沒載入 還沒寫這功能
// router.post('/followships/:userId', authenticated, userController.addFollowing)
// router.delete('/followships/:userId', authenticated, userController.deleteFollowing)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logOut)
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
