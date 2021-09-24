const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).isAdmin) {
      return next()
    }
    req.flash('error_messages', '管理員請由後台登入')
  }
  res.redirect('/signin')
}


router.get('/', (req, res) => res.redirect('/tweets'))

// user register
router.get('/signup', userController.getSignup)
router.post('/signup', userController.postSignup)

// user login
router.get('/signin', userController.getLogin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.postLogin)
router.get('/logout', userController.logout)

module.exports = router