const express = require('express')
const router = express.Router()

// controllers
const userController = require('../../../controllers/pages/user-controller')

router.post('/:id', userController.addFollowing)
router.delete('/:id', userController.removeFollowing)

module.exports = router