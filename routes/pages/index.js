const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/signin', (req, res) => {
  res.render('signin')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.get('/settings', (req, res) => {
  res.render('settings')
})

router.use('/', (req, res) => res.render('index'))

module.exports = router
