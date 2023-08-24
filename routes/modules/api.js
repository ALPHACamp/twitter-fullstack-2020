const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedSelfOnly } = require('../../middleware/auth')

router.get('/users/:id', authenticated, authenticatedSelfOnly, userController.getEditPage)
router.post('/users/:id', authenticated, authenticatedSelfOnly, userController.editUser)

module.exports = router
