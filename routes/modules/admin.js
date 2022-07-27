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

router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

router.get('/users', adminController.getUsers)

module.exports = router
