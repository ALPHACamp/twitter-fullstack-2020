const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

router.get('/signup', userController.signUpPage)

module.exports = router
