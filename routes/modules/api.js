const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')



router.get('/users/:id', authenticated, userController.editUser)
router.post('/users/:id', authenticated, userController.putUser)

module.exports = router