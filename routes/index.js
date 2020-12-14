const express = require('express')
const router = express.Router()
const admin = require('./admin')
const users = require('./users')
const tweets = require('./tweets')
const auth = require('../middleware/auth.js')


router.use('/admin', admin)
router.use('/users',auth.authenticated , users)
router.use('/tweets',auth.authenticated, tweets)
router.use('/', home)

module.exports = router