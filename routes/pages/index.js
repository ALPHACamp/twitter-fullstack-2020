const express = require('express')
const router = express.Router()

// routes
const admin = require('./modules/admin')
const tweet = require('./modules/tweet')
const user = require('./modules/user')
const api = require('./modules/api')

// passport & auth
const passport = require('../../config/passport')
const { authenticatedUser } = require('../../middlewares/auth')

const errorHandler = require('../../middlewares/error-handler')
const userController = require('../../controllers/pages/user-controller')
const followshipController = require('../../controllers/pages/followship-controller')

/// ////////需要刪除//////////////
router.get('/css_template2', (req, res) => res.render('main/edit_user_info'))
router.get('/css_template1', (req, res) => res.render('main/user_card'))
router.get('/notification', (req, res) => res.render('partials/notification'))
router.get('/css_template', (req, res) => res.render('main/css_template')) // 展現各前端模板，咖發結束後刪除
/// ////////需要刪除//////////////

// signin
router.get('/signin', userController.getLoginPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.postLogin)
router.get('/logout', userController.getLogout)

// signup
router.get('/signup', userController.getSignupPage)
router.post('/signup', userController.postSignup)

// routes
router.use('/admin', admin)
router.use('/users', authenticatedUser, user)
router.use('/tweets', authenticatedUser, tweet)
router.use('/api/users', authenticatedUser, api)

// followship
router.post('/followships', authenticatedUser, followshipController.postFollowship)
router.delete('/followships/:id', authenticatedUser, followshipController.deleteFollowship)

// redirect other url
router.use('/', (req, res) => {
  res.redirect('/tweets')
})

// error handling
router.use('/', errorHandler)

module.exports = router
