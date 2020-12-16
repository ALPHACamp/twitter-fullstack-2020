const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')

router.get('/signin', homeController.signInPage)
router.get('/signup', homeController.signUpPage)
router.post('/signup', homeController.signup)

module.exports = router