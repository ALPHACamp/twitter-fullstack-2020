const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const apis = require('./modules/api')

const { apiErrorHandler } = require('../middleware/error-handler.js')

const userController = require('../controllers/user-controller')

router.use('/admin', admin) // 未添加認證
router.use('/users', users) // 未添加認證
router.use('/tweets', tweets) // 未添加認證
router.use('/api', apis) // 未添加認證

router.get('/signup', userController.signInPage)
router.post('/signup', userController.signUp)
router.get('/signup', userController.signUpPage)
router.post('/signin', userController.signIn) // 未添加local帳號密碼認證 passport.authenticate('local', { session: false })
router.post('/followships', userController.postFollow) // 未添加認證
router.delete('/followships', userController.postUnfollow) // 未添加認證
router.use('/', apiErrorHandler)

module.exports = router
