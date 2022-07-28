const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')
const followController = require('../controllers/follow-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const user = require('./modules/user')


router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.post('/tweets/:id/like', authenticated, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)
router.get('/followships/top10', followController.getTopFollowers)
router.delete('/followships/:id', authenticated, followController.removeFollow)
router.post('/followships', authenticated, followController.addFollow)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.use('/admin', admin)
router.use('/users', user)
router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
