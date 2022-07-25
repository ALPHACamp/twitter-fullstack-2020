const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.use('/', generalErrorHandler)

module.exports = router
