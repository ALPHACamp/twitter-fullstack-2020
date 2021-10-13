const router = require('express').Router()
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User

const authenticatedAdmin = async (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    const user = await User.findByPk(helpers.getUser(req).id)
    if (user.dataValues.role === 'admin') { 
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

router.get('/tweets', authenticatedAdmin)

module.exports = router