const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

router.post(
  '/signin',
  passport.authenticate('admin-local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }),
  adminController.signIn
)
router.get('/signin', adminController.signInPage)
router.get('/logout', authenticatedAdmin, adminController.logout)

router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

router.get('/', (req, res) => {
  res.redirect('/admin/tweets')
})

module.exports = router
