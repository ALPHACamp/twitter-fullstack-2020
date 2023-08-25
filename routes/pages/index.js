const express = require('express')

const errorHandler = require('../../middlewares/error-handler')
const admin = require('./modules/admin')
const tweet = require('./modules/tweet')
const { userLocalAuth, userJWTAuth, sendToken, isAuthenticated } = require('../../middlewares/auth')
const userController = require('../../controllers/pages/user-controller')

const router = express.Router()

router.get('/css_template2', (req, res) => res.render('main/edit_user_info'))
router.get('/css_template1', (req, res) => res.render('main/user_card'))
router.get('/notification', (req, res) => res.render('partials/notification'))
router.get('/css_template', (req, res) => res.render('main/css_template')) // 展現各前端模板，咖發結束後刪除

router.use('/admin', admin)

router.use('/tweets', userJWTAuth, tweet)

router.get('/signin', isAuthenticated, userController.getUserSignInPage)
router.get('/signup', userController.getUserSignUpPage)
router.get('/logout', userController.userLogout)
router.post('/signin', userLocalAuth, sendToken, userController.userSignin)

router.use('/', (req, res) => {
// 預留，將找不到router的網址都先轉入root
  res.redirect('/tweets')
})

/* Error handleling, 接住所有的error */
router.use('/', errorHandler)

module.exports = router
