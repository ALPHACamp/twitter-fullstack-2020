const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')
const api = require('./modules/api')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入登出
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }), userController.signIn)
router.post('/signout', userController.signOut)

// users路由
router.use('/users', authenticated, users)

// api路由
router.use('/api', authenticated, api)

// tweets路由
router.use('/tweets', authenticated, tweets)

// followships 路由
router.use('/followships', authenticated, followships)

// 後台
router.use('/admin', admin)


router.use('/', generalErrorHandler)
router.use('', (req, res) => res.redirect('/tweets'))

module.exports = router