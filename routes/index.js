const express = require('express')
const router = express.Router()


const userController = require('../controllers/user-controller')




router.get('/', (req, res) => {
  res.render('right')
})
module.exports = router