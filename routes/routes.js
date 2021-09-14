const express = require('express')
const router = express.Router()

// 要放passport

const helpers = require('../_helpers')

const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')
const loginController = require('../controllers/loginController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')


router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)






module.exports = router