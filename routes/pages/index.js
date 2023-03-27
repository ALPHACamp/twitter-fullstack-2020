const express = require('express')
const router = express.Router()
const mainPageController = require('../../controllers/pages/mainPage-controller')
const userController = require('../../controllers/pages/user-controller')
const tweetController = require('../../controllers/pages/tweet-controller')
const { generalErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')






//admin routes 
const admin = require('./modules/admin')
router.use('/admin', admin)

//normal users
//regist
router.get('/regist', userController.registPage)
router.post('/regist', userController.regist)

// login & logout
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn) // 注意是 post
router.get('/logout', userController.logout)


router.post('/tweets/:id/like', userController.addLike)
router.delete('/tweets/:id/like', userController.removeLike)

// router.post('/tweets/:id/replies', tweetController.postReply)
router.get('/tweets/:id', tweetController.getTweet)
router.get('/tweets/', tweetController.getTweets)

router.use('/test', (req, res) => res.render('test'))
router.use('/', (req, res) => res.redirect('/tweets'))


//main page
router.get('/main', mainPageController.getMainPage)

router.use('/', (req, res) => res.redirect('/main'))
router.use('/', generalErrorHandler)


module.exports = router
