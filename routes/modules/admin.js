const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { adminAuthenticated } = require('../../middleware/auth')

router.get('/signin', adminController.adminSigninPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  adminController.adminSignin
)
router.get('/tweets', adminAuthenticated, adminController.adminGetTweets)
router.get('/users', adminAuthenticated, adminController.adminGetUsers)

router.use('/', (req, res) => res.redirect('/admin/tweets'))
router.get('', (req, res) => res.redirect('/admin/tweets'))

module.exports = router
