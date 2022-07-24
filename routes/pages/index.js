const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')

const { apiErrorHandler } = require('../../middleware/error-handler.js')

const adminController = require('../../controllers/apis/admin-controller')
const tweetController = require('../../controllers/apis/tweet-controller')
const userController = require('../../controllers/apis/user-controller')

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

router.post('/logout', (req, res) => {
  req.logout()
})
router.use('/', (req, res) => res.render('signin-front'))
router.use('/', apiErrorHandler)

module.exports = router

