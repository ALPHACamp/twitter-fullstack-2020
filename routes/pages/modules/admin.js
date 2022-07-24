const express = require('express')
const router = express.Router()

router.get('/signin', (req, res) => {
  res.render('admin/signin')
})

router.use('/', (req, res) => res.render('admin/index'))

module.exports = router
