const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.use('/', generalErrorHandler)

router.get('/user', userController.getOther)

module.exports = router
