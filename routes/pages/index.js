const express = require('express')

const helper = require('../../_helpers')
const admin = require('./modules/admin')
const tweet = require('./modules/tweet')
const user = require('./modules/user')
const api = require('./modules/api')
const errorHandler = require('../../middlewares/error-handler')
const { userJWTAuth, sendToken, isAuthenticated } = require('../../middlewares/auth')
const userController = require('../../controllers/pages/user-controller')
const followshipController = require('../../controllers/pages/followship-controller')

const router = express.Router()

router.get('/css_template2', (req, res) => res.render('main/edit_user_info'))
router.get('/css_template1', (req, res) => res.render('main/user_card'))
router.get('/notification', (req, res) => res.render('partials/notification'))
router.get('/css_template', (req, res) => res.render('main/css_template')) // 展現各前端模板，咖發結束後刪除

router.use('/admin', admin)
router.use('/users', userJWTAuth, user)
router.use('/tweets', userJWTAuth, tweet)
router.use('/api/users', userJWTAuth, api)

router.get('/signin', userJWTAuth, userController.getUserSignInPage)
router.get('/signup', userController.getUserSignUpPage)
router.get('/logout', userController.userLogout)
router.post('/signin', userJWTAuth, sendToken, userController.userSignIn)
router.post('/signup', userController.userSignUp)

/* 測試檔把followship放在最外面 */
router.post('/followships', userJWTAuth, followshipController.postFollowship)
router.delete('/followships/:id', userJWTAuth, followshipController.deleteFollowship)

router.use('/', (req, res) => {
// 預留，將找不到router的網址都先轉入root
  res.redirect('/tweets')
})

/* Error handleling, 接住所有的error */
router.use('/', errorHandler)

module.exports = router
