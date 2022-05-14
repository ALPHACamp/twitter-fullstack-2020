const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id/tweets', userController.getUser)
router.get('/:id/likes', userController.getLikes)

module.exports = router