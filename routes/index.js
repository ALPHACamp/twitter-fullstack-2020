const express = require('express')
const router = express.Router()
// const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
// const passport = require('../config/passport')

const userController = require('../controller/userController')
const exampleController = require('../controller/exampleController')

router.get('/users/:id', userController.getUser)

router.get('/', exampleController.indexPage)
router.use('/', generalErrorHandler)

module.exports = router
