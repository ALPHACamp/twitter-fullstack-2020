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


router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)

router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), loginController.signIn)
router.get('/logout', loginController.logOut)
router.get('/tweets', tweetController.getTweets)

// 如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', (req, res) => {
  res.redirect('/tweets')
})


module.exports = router