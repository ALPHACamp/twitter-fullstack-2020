const express = require('express')
const router = express()

const userController = require('../controllers/userController')

router.get('/signup', userController.getSignup)
router.post('/signup', userController.postSignup)


module.exports = router