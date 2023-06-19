const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { adminAuthenticated } = require('../../middleware/auth')

// signin
router.get('/signin', adminController.adminSigninPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }),
  adminController.adminSignin
)

// logout
router.get('/logout', adminController.logout)
router.get('/tweets', adminAuthenticated, adminController.adminGetTweets)
router.delete('/tweets/:id', adminAuthenticated, adminController.deleteTweet)
router.get('/users', adminAuthenticated, adminController.adminGetUsers)

router.use('/', (req, res) => res.redirect('/admin/tweets'))
router.get('', (req, res) => res.redirect('/admin/tweets'))

module.exports = router
