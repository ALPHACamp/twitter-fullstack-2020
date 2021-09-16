const express = require('express')
const app = require('../app')
const router = express()
const passport = require('../config/passport')
const userController = require('../controllers/userController')

// user register
router.get('/signup', userController.getSignup)
router.post('/signup', userController.postSignup)
// user login
router.get('/login', userController.getLogin)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.postLogin)
router.get('/logout', userController.logout)
//user's profile
router.get('/self', userController.getUser)


module.exports = router