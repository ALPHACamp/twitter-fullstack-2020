const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const admin = require('./modules/admin')

const userController = require('../../controllers/pages/user-controller')
const tweetController = require('../../controllers/pages/tweet-controller')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.getSignin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.postSignin)
router.get('/logout', userController.logout)

router.get('/setting/:id', authenticated, userController.getSetting)
router.put('/setting/:id', authenticated, userController.editSetting)

router.get('/tweets', authenticated, tweetController.getTweets)

router.get('/', (req, res) => res.send('Hello World!'))

module.exports = router
