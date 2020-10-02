const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const passport = require('../config/passport')
const helpers = require('../_helpers');
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')

const adminAuthenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && helpers.getUser(req).isAdmin)
    return next()
  return res.redirect('/admin/signin')
}

const userAuthenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req) && !helpers.getUser(req).isAdmin)
    return next()
  return res.redirect('/signin')
}
//////////////////////////////////////////////////////////////////////////////////



router.get('/', (req, res) => { res.redirect('/tweets') })

router.get('/tweets', userAuthenticated, tweetController.getTweets)

router.get('/signin', userController.getSigninPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signin)

router.get('/admin/tweets', adminAuthenticated, adminController.getTweets)
router.get('/admin/signin', adminController.getSigninPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin' }), adminController.signin)



module.exports = router