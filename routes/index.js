const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport')
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')

const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin',  admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/logout', userController.logout)

// router.get('/users/:id', authenticated, userController.getTweets)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
// router.get('/users/:id/tweets', authenticated, userController.getTweets)
// router.put('/users/:id', authenticated, userController.putUser)
router.get('/users/:id', authenticated, userController.getTweets)

router.get('/tweets/:id/replies', authenticated, tweetController.getReplies)
router.post('/tweets/:id/replies', authenticated, tweetController.createReply)
router.post('/tweets/:id/like', authenticated, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)

router.get('/edit', authenticated, userController.editUserPage)
router.put('/edit', authenticated, userController.editUser)

router.post('/followships', authenticated, userController.addFollowship)
router.delete('/followships/:id', authenticated, userController.removeFollowship)

router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)

router.use('/', (req, res) => res.redirect('/tweets'))
router.use('/', generalErrorHandler)

module.exports = router
