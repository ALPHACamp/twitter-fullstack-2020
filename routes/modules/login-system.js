const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')

// signin
router.get('/signin', userController.signinPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signin
)

// signup
router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)

// logout
router.get('/logout', userController.logout)

module.exports = router
