const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.send(' admin hellow world'))

module.exports = router
