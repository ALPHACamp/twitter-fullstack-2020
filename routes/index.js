const express = require('express')
const router = express.Router()
const admin = require('./admin')
const users = require('./users')
const tweets = require('./tweets')
const home = require('./home')
const api = require('./api')
const chats = require('./chats')
const auth = require('../middleware/auth')


router.use('/api', api)
router.use('/admin', admin)
router.use('/users', auth.authenticated, users)
router.use('/tweets', auth.authenticated, tweets)
router.use('/chats', auth.authenticated, chats)
router.use('/', home)


module.exports = router