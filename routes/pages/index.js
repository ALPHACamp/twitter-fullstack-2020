const express = require('express')
const router = express.Router()
const mainPageController = require('../../controllers/pages/mainPage-controller')
const userController = require('../../controllers/pages/user-controller')
const tweetController = require('../../controllers/pages/tweet-controller')
const { generalErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')







const admin = require('./modules/admin')
router.use('/admin', admin)

router.get('/regist', userController.registPage)
router.post('/regist', userController.regist)


router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)
router.get('/logout', userController.logout)






router.get('/users/:id/tweets', userController.getUserTweets)
router.get('/users/:id/replies', userController.getUserReplies)
router.get('/users/:id/likes', userController.getUserLikes)
router.get('/users/:id/followers', userController.getUserFollowers)
router.get('/users/:id/followings', userController.getUserFollowings)

router.get('/tweets/:id', tweetController.getTweet)
router.get('/tweets/', tweetController.getTweets)
router.get('/setting', userController.settingPage)
router.post('/setting', userController.setting)

router.use('/test', (req, res) => res.render('test'))
router.use('/', (req, res) => res.redirect('/tweets'))



router.use('/', (req, res) => res.redirect('/tweets'))  //authenticate fail then go login
router.use('/', generalErrorHandler)


module.exports = router
