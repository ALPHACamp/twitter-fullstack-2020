const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const helpers = require('../../_helpers')

const adminController = require('../../controllers/adminController')

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
  }
  res.redirect('/signin')
}

router.get('/signin', adminController.signInPage)
router.post('/signin',passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  adminController.signIn
)


// Admin
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:tweetId',authenticatedAdmin,adminController.deleteTweet)
router.get('/users', authenticatedAdmin, adminController.getUsers)


module.exports = router
