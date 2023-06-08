const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { authenticated } = require('../middleware/auth')


const { generalErrorHandler } = require('../middleware/error-handler')


// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入登出
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true, successRedirect: '/tweets' }), userController.signIn)
router.get('/signout', userController.signOut)


// 登入後的假首頁(測試用)
router.get('/tweets', authenticated, (req, res) => {
  res.send('twitter home page')
})


router.get('/example', (req, res, next) => {
  res.render('example')

  // 以下為訊息的樣板，直接使用req.flash達成
  req.flash('danger_msg', 'danger')
  req.flash('success_msg', 'success')
  req.flash('warning_msg', 'warning')
  req.flash('info_msg', 'info')
})

router.post('/example', (req, res, next) => {

  // 錯誤訊息(紅色的)可以另外用 throw new Error 來處理
  try {
    throw new Error('name is required')
  } catch (err) {
    next(err)
  }
})

router.use('/admin', admin)

router.use('', (req, res) => res.redirect('/tweets'))

router.get('/tweets', (req, res) => {
  res.render('tweets')
})

router.use('/', generalErrorHandler)

module.exports = router