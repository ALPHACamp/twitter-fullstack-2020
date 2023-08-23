const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const tweetController = require('../controllers/tweet-controller')
const userController = require('../controllers/user-controller')
const replyController = require('../controllers/reply-controller')

router.use('/admin', admin)

router.get('/', (req, res) => res.send('Hello World!'))
// add routes here

router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
