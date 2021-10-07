const router = require('express').Router()
const loginController = require('../controllers/loginController')
const passport = require('../config/passport')

router.get('/signup', loginController.signupPage)

router.get('/signup/:account', loginController.signupAccountCheck)

router.get('/signin', loginController.signinPage)

router.post('/signup', loginController.signUp)

router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), loginController.signIn)

module.exports = router