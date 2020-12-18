const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/:id/followings', userController.getFollowings)

module.exports = router