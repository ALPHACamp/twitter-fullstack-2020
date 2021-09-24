const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')

const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

const isAuthenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      console.log(helpers.getUser(req))
      return next()
    }
    console.log(helpers.getUser(req))
    req.flash('error_messages', '只有管理員可登入後台')
  }
  res.redirect('/admin/signin')
}


// admin login & logout
router.get('/signin', adminController.getLogin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.postLogin)
router.get('/logout', adminController.logout)

router.get('/tweets', isAuthenticatedAdmin, adminController.getTweets)
router.get('/users', isAuthenticatedAdmin, adminController.getUsers)
router.delete('/tweets/:id', isAuthenticatedAdmin, adminController.deleteTweet)


module.exports = router