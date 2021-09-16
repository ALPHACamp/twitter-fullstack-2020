const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated) {
    return next()
  }
  res.redirect('/users/signup')
}

// user register
router.get('/signup', userController.getSignup)
router.post('/signup', userController.postSignup)

// user login
router.get('/login', userController.getLogin)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.postLogin)
router.get('/logout', userController.logout)


router.get('/', (req, res) => res.redirect('/users/self'))

//user's profile
router.get('/self', userController.getUser)


module.exports = router