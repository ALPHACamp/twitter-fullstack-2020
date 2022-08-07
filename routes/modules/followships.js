const express = require('express')
const router = express.Router()
const followshipsController = require('../../controllers/followships-controller')

router.delete('/:followingId', followshipsController.removeFollowing)
router.post('/', followshipsController.addFollowing)

module.exports = router
