const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

const { authenticated } = require('../../middleware/auth')

// followships
router.use('/', authenticated)
router.post('/', followshipController.addFollowing)
router.delete('/:userId', followshipController.removeFollowing)

module.exports = router
