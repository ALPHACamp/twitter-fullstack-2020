const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')
const passport = require('../config/passport')
const db = require('../models')
const User = db.User
const adminController = require('../controllers/adminController')
const { authenticatedAdmin } = require('../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/admin/tweets',
  failureRedirect: '/admin/signin',
  failureFlash: true
}))

router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

router.get('/users', authenticatedAdmin, adminController.getUsers)

module.exports = router