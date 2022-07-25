const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:id', userController.getUserProfile)
router.post('/:id', userController.postUserProfile)

module.exports = router
