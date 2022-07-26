const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signinPage)

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }),
  authenticatedAdmin,
  adminController.signIn
)

router.get('/logout', adminController.logout)

router.get('/tweets', authenticatedAdmin, adminController.getTweets)

router.get('/users', authenticatedAdmin, adminController.getUsers)

module.exports = router
