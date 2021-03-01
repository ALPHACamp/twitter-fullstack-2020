const express = require('express')
const router = express.Router()
const passport = require('passport')

const auth = require('../config/auth')
const userController = require('../controllers/userController')

router.get('/signin', userController.signInPage)
router.get('/admin/signin', userController.AdminSignInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin'
}), userController.signIn)
router.post('/admin/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin'
}), userController.AdminSignIn)
router.get('/signout', userController.logout)

router.get('/tweets', auth.authenticatedUser, (req, res) => res.render('tweets'))
router.get('/admin/tweets', auth.authenticatedAdmin, (req, res) => res.render('tweets'))

module.exports = router