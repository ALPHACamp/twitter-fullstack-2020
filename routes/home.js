const express = require('express')
const router = express.Router()
const authenticated = require('../middleware/auth').authenticated
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const passport = require('passport')

router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
router.get('/tweets', authenticated, tweetController.getTweet)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/tweets',
  failureRedirect: '/signin',
  successFlash: true,
  failureFlash: true
}))
router.get('/logout', userController.logout)



module.exports = router