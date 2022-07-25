
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const api = require('./modules/api')

const { apiErrorHandler } = require('../middleware/error-handler.js')

const userController = require('../controllers/user-controller')

router.use('/admin', admin) // 未添加認證
router.use('/users', users) // 未添加認證
router.use('/tweets', tweets) // 未添加認證
router.use('/api', api) // 未添加認證

router.post('/signup', userController.signUp)
router.get('/signup', userController.signUpPage)
router.post(
  '/signin',
  passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
  userController.signIn
)
router.get('/signin', userController.signInPage)
router.get('/logout', userController.logout)
router.post('/followships', userController.postFollow) // 未添加認證
router.delete('/followships', userController.postUnfollow) // 未添加認證
router.get('/', userController.signInPage)
router.use('/', apiErrorHandler)

module.exports = router
