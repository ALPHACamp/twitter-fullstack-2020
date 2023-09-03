const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/pages/user-controller')

router.post('/followships', userController.addFollowing)
router.delete('/followships/:followingId', userController.removeFollowing)

module.exports = router
