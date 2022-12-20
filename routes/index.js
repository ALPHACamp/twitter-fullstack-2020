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
//followings
router.get('/users/followings', userController.getFollower)

//personal
router.get('/users/tweets', userController.getPerson)
//使用者帳戶資訊，驗證不要忘記阻擋非user
router.get('/users/:id/edit', userController.editSetting)
router.put('/users/:id', userController.putSetting)
//replies
router.get('/users/replies', userController.reply)
//tweets
router.get('/tweets', userController.getTweets)
router.get('/tweet', userController.getTweet)
router.post('/tweets', tweetController.postTweet)

// //fallback
router.get('/', (req, res) => { res.redirect('/tweets') })
router.use('/', generalErrorHandler)

module.exports = router
