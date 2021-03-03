const express = require('express')
const router = express.Router()
const passport = require('passport')

const auth = require('../config/auth')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')


router.get('/', (req, res) => res.redirect('/signin'))
router.get('/signin', userController.signInPage)
router.get('/admin/signin', userController.AdminSignInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin'
}), userController.signIn)
router.post('/admin/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin'
}), userController.AdminSignIn)
router.get('/signout', userController.logout)

router.get('/tweets', auth.authenticatedUser, (req, res) => res.render('test'))
router.get('/admin/tweets', auth.authenticatedAdmin, adminController.getTweets)

router.get('/followships', auth.authenticatedUser, userController.addFavorite)
router.delete('/followships/:id', auth.authenticatedUser, userController.removeFavorite)

router.post('/tweets/:tweetId/like', auth.authenticatedUser, userController.addLike)
router.delete('/tweets/:tweetId/unlike', auth.authenticatedUser, userController.removeLike)

module.exports = router