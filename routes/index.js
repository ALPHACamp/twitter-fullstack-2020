const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const tweet = require('./modules/tweet')
const user = require('./modules/user')
const api = require('./modules/api')

const userController = require('../controllers/pages/user-controller')
const followshipController = require('../controllers/pages/followship-controller')

const errorHandler = require('../middlewares/error-handler')
const { userJWTAuth, sendToken } = require('../middlewares/auth')

router.use('/admin', admin)
router.use('/users', userJWTAuth, user)
router.use('/tweets', userJWTAuth, tweet)
router.use('/api/users', userJWTAuth, api)

// user sign in
router.get('/signin', userJWTAuth, userController.getLoginPage)
router.post('/signin', userJWTAuth, sendToken, userController.postLogin)

// user sign up
router.get('/signup', userController.getSignupPage)
router.post('/signup', userController.postSignup)

// user logout
router.get('/logout', userController.getLogout)

// follow feature
router.post('/followships', userJWTAuth, followshipController.postFollowship)
router.delete('/followships/:id', userJWTAuth, followshipController.deleteFollowship)

/* 暫時，開發完刪除 */
router.get('/css_template2', (req, res) => res.render('main/edit_user_info'))
router.get('/css_template1', (req, res) => res.render('main/user_card'))
router.get('/notification', (req, res) => res.render('partials/notification'))
router.get('/css_template', (req, res) => res.render('main/css_template'))

router.use('/', (req, res) => {
  res.redirect('/tweets')
})

/* Error handleling, 接住所有的error */
router.use('/', errorHandler)

module.exports = router
