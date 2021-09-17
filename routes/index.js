const express = require('express')
const router = express.Router()
//admin
const adminHome = require('./admin/home')
const adminUser = require('./admin/user')
const adminTweet = require('./admin/tweet')

const home = require('./home')
const user = require('./user')
const tweet = require('./tweet')
const followship = require('./followship')

const apiUser = require('./api/user')

router.use('/users', user)
router.use('/tweets', tweet)
router.use('/followships', followship)
router.use('/', home)

router.use('/admin/users', adminUser)
router.use('/admin/tweets', adminTweet)
router.use('/admin', adminHome)

router.use('/api/users', apiUser)

module.exports = router
