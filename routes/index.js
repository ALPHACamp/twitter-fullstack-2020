const express = require('express')
const router = express.Router()
// const helpers = require('../_helpers')
router.get('/', (req, res) => {
  res.send('Hello World!')
})
module.exports = router
