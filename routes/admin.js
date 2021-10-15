const router = require('express').Router()
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')
const helpers = require('../_helpers')

const checkAdminRole = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role !== 'admin') {
      return res.redirect('/admin/signin')
    }
    return next()
  }
  return res.redirect('/signin')
}

router.get('/signin', adminController.signinPage)

router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin',
  failureFlash: true
}), adminController.signin)

router.get('/tweets', checkAdminRole, adminController.getTweets)

router.get('/users', checkAdminRole, adminController.getUsers)

router.delete('/tweets/:id', checkAdminRole, adminController.deleteTweet)

module.exports = router