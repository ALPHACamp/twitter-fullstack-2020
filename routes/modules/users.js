const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:uid', (req, res) => {
  res.render('example')
})

module.exports = router