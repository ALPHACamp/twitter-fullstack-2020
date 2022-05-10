const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/', (req, res) => {
  res.redirect('/admin/tweets')
})

module.exports = router
