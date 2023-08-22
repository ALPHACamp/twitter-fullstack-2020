const express = require('express')
const passport = require('../config/passport')
const tweetsController = require('../controllers/tweets-controller')
const usersController = require('../controllers/users-controller')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/signup', usersController.signupPage)
router.post('/signup', usersController.signup)
router.get('/signin', usersController.signinPage)
// router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), usersController.sigin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), usersController.sigin)
router.get('/logout', usersController.logout)

router.get('/tweets', (req, res) => {
  res.render('tweets')
})
router.post('/tweets', tweetsController.postTweet)

module.exports = router
