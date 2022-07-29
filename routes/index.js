const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const userController = require('../controllers/user-controller')
const followshipController = require('../controllers/followship-controller')
const tweetController = require('../controllers/tweet-controller')

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/users/:id/setting', authenticated, userController.getSetting)
router.get('/users', authenticated, userController.getUsers)

router.post('/followships/:userId', authenticated, followshipController.addFollowing)
router.delete('/followships/:userId', authenticated, followshipController.removeFollowing)

router.get('/tweets', tweetController.getTweets)

router.use('/', (req, res) => res.redirect('users'))
router.use('/', generalErrorHandler)

module.exports = router
