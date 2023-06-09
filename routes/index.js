const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')

const { generalErrorHandler } = require('../middleware/error-handler')
const users = require('./modules/users')

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入登出
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true, successRedirect: '/tweets' }), userController.signIn)
router.post('/signout', userController.signOut)

// users路由
router.get('/tweets', (req, res) => res.render('tweets'))
router.use('/users', authenticated, users)

router.use('/', generalErrorHandler)
router.use('', (req, res) => res.redirect('/tweets'))


module.exports = router