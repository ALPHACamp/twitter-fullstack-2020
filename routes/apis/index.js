const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

const { apiErrorHandler } = require('../../middleware/error-handler.js')

const userController = require('../../controllers/apis/user-controller')

router.use('/admin', admin) // 未添加認證
router.use('/users', users) // 未添加認證
router.use('/tweets', tweets) // 未添加認證

router.post('/signup', userController.signUp) // 已寫
router.post('/signin', userController.signIn) // 未添加local帳號密碼認證 passport.authenticate('local', { session: false })
router.post('/followships', userController.postFollow) // 未添加認證
router.delete('/followships', userController.postUnfollow) // 未添加認證
router.use('/', apiErrorHandler)

module.exports = router
