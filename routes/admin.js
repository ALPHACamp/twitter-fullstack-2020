const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')
const passport = require('../config/passport')
const db = require('../models')
const User = db.User

router.get('/signin', (req, res) => {
  return res.render('admin/signin')
})

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/admin/tweets',
  failureRedirect: '/admin/signin',
  failureFlash: true
}))

router.get('/tweets', (req, res) => {
  return res.render('admin/tweet')
})

module.exports = router