const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const passport = require('passport')

const { generalErrorHandler } = require('../middleware/error-handler')

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

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入頁
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureMessage: true, faliureRedirect: '/signin' }), userController.signIn)

// 登入後的假首頁
router.get('/tweets', (req, res) => {
  res.send('twitter home page')
})

router.use('/', generalErrorHandler)

module.exports = router