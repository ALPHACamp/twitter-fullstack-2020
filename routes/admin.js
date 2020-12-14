const express = require('express')
const router = express.Router()

router.get('/signin', (req, res) => {
  return res.render('admin/signin')
})

module.exports = router