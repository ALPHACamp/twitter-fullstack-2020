const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')

const adminController = require('../controllers/adminController')

const isAuthenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    req.flash('error_messages', '只有管理員可登入後台')
  }
  res.redirect('/admins/login')
}


// admin login & logout
router.get('/login', adminController.getLogin)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), adminController.postLogin)
router.get('/logout', adminController.logout)



module.exports = router