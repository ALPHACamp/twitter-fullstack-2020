const express = require('express')
const router = express.Router()

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

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.get('/tweets', (req, res) => {
  res.render('tweets')
})

router.use('/', generalErrorHandler)

module.exports = router