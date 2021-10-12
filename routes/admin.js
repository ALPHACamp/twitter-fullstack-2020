const router = require('express').Router()
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') { 
      return next() 
    } 
  }
  req.flash('error_messages', '請先登入')
  return res.redirect('/admin/signin')
}

router.get('/signin', adminController.signinPage)

router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin',
  failureFlash: true
}), adminController.signin)

module.exports = router