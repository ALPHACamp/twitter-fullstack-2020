const express = require('express')
const router = express.Router()

const tweets = require('./modules/tweets.js')
const users = require('./modules/users.js')

router.use('/tweets', tweets)
router.use('/users', users)

module.exports = router
