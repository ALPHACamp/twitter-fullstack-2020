const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
// 載入controller
const userController = require('../controller/user-controller')
const tweetController = require('../controller/tweet-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)



//signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
//

//logout
router.get('/logout', userController.logout)

//register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//users
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replies', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)


//tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweet', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.postTweet)

// //fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
