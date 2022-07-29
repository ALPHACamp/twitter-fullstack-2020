const express = require('express')
const router = express.Router()
const followshipsController = require('../../controllers/followships-controller')

router.post('/', followshipsController.addFollowing)
router.delete('/:followingId', followshipsController.removeFollowing)

module.exports = router
