const express = require('express')
const router = express.Router()

const userController = require('../../controllers/apis/user-controller')

router.get('/users/:userId', userController.getUser)

module.exports = router
