const express = require('express')
const router = express.Router()

const passport = require('passport')

const helpers = require('../_helpers')

const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')
const loginController = require('../controllers/loginController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

 const authenticated = (req, res, next) => {
   if (helpers.ensureAuthenticated(req)) {
     return next()
   }
   res.redirect('/signin')
 }
 const authenticatedAdmin = (req, res, next) => {
   if (helpers.ensureAuthenticated(req)) {
     if (helpers.getUser.role) { return next() }
   }
   res.redirect('/admin/signin')
 }




// tweets相關路由
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:tweetId/replies', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.addTweet)
router.post('/tweets/:tweetId/replies', authenticated, tweetController.postReplies)
router.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
router.delete('/tweets/:tweetId/unlike', authenticated, tweetController.removeLike)

// User
// signin
router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)

router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logOut)



router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)


//routes for follow
router.get('/following', authenticated, userController.getFollowings)
router.get('/follower', authenticated, userController.getFollowers)
router.post('/followships/:userId', authenticated, followshipController.addFollowing)
router.delete('/followships/:userId', authenticated, followshipController.removeFollowing)


router.get('/admin/tweets', authenticatedAdmin, adminController.tweets)


// tweets
router.get('/tweets', authenticated, tweetController.getTweets)



// users
//以下都還要加userid
router.get('/users/tweets', authenticated, userController.getUserTweets)
router.get('/users/replies', authenticated, userController.getReplies)
router.get('/users/likes', authenticated, userController.getLikes)



// Admin
router.get('/admin/signin', authenticatedAdmin, adminController.signInPage)
router.post('/admin/signin', authenticatedAdmin, adminController.signIn)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

// 如果使用者訪問首頁，就導向 /tweets 的頁面
router.get('/', authenticated, (req, res) => { res.redirect('/tweets') })

module.exports = router