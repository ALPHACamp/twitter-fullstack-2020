const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

const helpers = require('../_helpers')

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

router.get('/', authenticated, (req, res) => res.redirect('/users'))

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/users'))
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signout', userController.signOut)

router.get('/tweets', tweetController.getTweets)
router.get('/tweets/:id', tweetController.getTweet)

module.exports = router