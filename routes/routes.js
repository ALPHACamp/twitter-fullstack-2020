const express = require('express')
const router = express.Router()
const passport = require('passport')

// 要放passport

const helpers = require('../_helpers')

const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')
const loginController = require('../controllers/loginController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

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

router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)

router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logOut)


// 如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) => {
  res.redirect('/tweets')
})


module.exports = router