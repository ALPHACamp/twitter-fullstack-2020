const express = require('express')
const router = express.Router()

const home = require('./modules/home.js')
const users = require('./modules/users.js')

router.use('/', home)
router.use('/users', users)

module.exports = router
