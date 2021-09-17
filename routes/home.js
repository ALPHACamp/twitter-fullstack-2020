const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')

const passport = require('../config/passport')

router.get('/signin', homeController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), homeController.signIn)

router.get('/signup', homeController.signUpPage)
router.post('/signup', homeController.signup)

module.exports = router