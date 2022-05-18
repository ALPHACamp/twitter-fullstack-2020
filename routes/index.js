const express = require('express')
const router = express.Router()
const passport = require('passport')
const upload = require('../middleware/multer')

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')
const apiController = require('../controllers/api-controller')

const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// api 路由入口
router.post('/api/users/:id', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), apiController.putUser)
router.get('/api/users/:id', authenticated, apiController.getUser)

// admin 路由入口
router.use('/admin', admin)

// admin 登入、登出路由
router.get('/admin/signin', adminController.signInPage)
router.post(
  '/admin/signin',
  passport.authenticate('admin-local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }),
  adminController.signIn
)
router.get('/admin/logout', adminController.logout)

// users 路由入口
router.use('/users', authenticated, users)
router.delete('/followships/:id', authenticated, userController.removeFollowing)
router.post('/followships', authenticated, userController.addFollowing)

// tweets 路由入口
router.use('/tweets', authenticated, tweets)

// 以下註冊、登入、登出路由以及followships
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('user-local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)

// fallback 路由
router.get('/', (req, res) => {
  res.redirect('/tweets')
})

router.use('/', generalErrorHandler)
module.exports = router
