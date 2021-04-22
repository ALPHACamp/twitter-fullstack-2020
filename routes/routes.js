const exrpess = require('express')
const router = exrpess.Router()
const helpers = require('../_helpers')
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

//一般使用者
const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

// 管理員
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    res.redirect('/')
  }
  res.redirect('/signin')
}

router.get('/', authenticated, (req, res) => { res.redirect('/tweets') })
router.get('/tweets', authenticated, tweetController.getTweets)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/admin/signin', adminController.signinPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
router.get('/admin/tweets', adminController.tweetsPage)
router.get('/admin/users', adminController.usersPage)

router.get('/logout', userController.logOut)

module.exports = router