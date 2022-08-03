const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')
const api = require('./modules/api')
const tweets = require('./modules/tweets')
const users = require('./modules/users')

const userController = require('../controllers/user-controller')
const followships = require('./modules/followships')
const likeController = require('../controllers/like-controller')

const { authenticatedUser } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/api', authenticatedUser, api)
router.use('/followships', authenticatedUser, followships)
router.use('/tweets', authenticatedUser, tweets)
router.use('/users', authenticatedUser, users)

router.get('/users/:id/setting', authenticatedUser, userController.getUserSetting)
router.get('/users/:userId', authenticatedUser, userController.getProfile)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', authenticatedUser, userController.logout)

router.get('/users/:id/likes', authenticatedUser, likeController.getUserLike)

router.use('/', (req, res) => {
  res.redirect('/tweets')
})

router.use('/', generalErrorHandler)

module.exports = router
