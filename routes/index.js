const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')

router.get('/', (req, res) => res.send('Hello World!'))

module.exports = router
