const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const api = require('./modules/api')

const { authenticatedUser, authenticatedAdmin } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler.js')

const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')

router.use('/admin', admin) // 未添加認證
router.use('/users', users) // 未添加認證
router.use('/tweets', authenticatedUser, tweets)
router.use('/api', api) // 未添加認證

router.post('/admin/signin',
  passport.authenticate('admin-local',
    { failureRedirect: '/admin/signin', failureFlash: true }),
  adminController.signIn)
router.get('/admin/signin', adminController.signInPage)
router.get('/admin/logout', adminController.logout)

router.post('/signup', userController.signUp)
router.get('/signup', userController.signUpPage)
router.post(
  '/signin',
  passport.authenticate('user-local',
    { failureRedirect: '/signin', failureFlash: true }),
  userController.signIn
)
router.get('/signin', userController.signInPage)
router.get('/logout', userController.logout)
router.post('/followships', userController.postFollow) // 未添加認證
router.delete('/followships', userController.postUnfollow) // 未添加認證

router.get('/', (req, res) => {
  res.redirect('/tweets')
})

router.use('/', apiErrorHandler)

module.exports = router
