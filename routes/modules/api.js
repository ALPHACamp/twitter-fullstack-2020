const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')



router.get('/users/:id', userController.editUser)
router.put('/users/:id', userController.putUser)

module.exports = router