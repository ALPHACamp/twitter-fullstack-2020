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

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role) return next()
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

// tweets相關路由
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.addTweet)

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
router.get('/', (req, res) => res.redirect('/tweets'))
router.get('/tweets', tweetController.getTweets)


// users
//以下都還要加userid
router.get('/users/tweets', userController.getUserTweets) 
router.get('/users/replies', userController.getReplies) 
router.get('/users/likes', userController.getLikes)  



// Admin
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', adminController.signIn)
router.get('/admin/tweets', adminController.getTweets)
router.get('/admin/users', adminController.getUsers)

// 如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) => {
  res.redirect('/tweets')
})

module.exports = router