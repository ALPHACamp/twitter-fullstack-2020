const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedSelfOnly } = require('../../middleware/auth')

router.get('/users/:userId', authenticated, authenticatedSelfOnly, userController.getEditPage)
router.post('/users/:userId', authenticated, authenticatedSelfOnly, userController.editUser)

module.exports = router
