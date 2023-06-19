const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const users = require('./modules/users')
const followships = require('./modules/followships')
const loginSystem = require('./modules/login-system')
const api = require('./modules/api')

const { generalErrorHandler } = require('../middleware/error-handler')

// admin
router.use('/admin', admin)

// signin signup logout
router.use('/', loginSystem)

// index
router.use('/tweets', tweets)

// profile
router.use('/users', users)

// followship
router.use('/followships', followships)

// api
router.use('/api', api)

router.use('/', (req, res) => res.redirect('/tweets'))

router.use('/', generalErrorHandler)

module.exports = router
