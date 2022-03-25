const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const tweetController = require('../controller/tweet-controller')
const userController = require('../controller/user-controller')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/tweets', tweetController.getTweets)

router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
