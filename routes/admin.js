const router = require('express').Router()
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')

router.get('/signin', adminController.signinPage)

router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/admin/signin',
  failureFlash: true
}), adminController.signin)

module.exports = router