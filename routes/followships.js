const router = require('express').Router()
const followshipsController = require('../controllers/followshipsController')

router.post('/', followshipsController.follow)

router.delete('/:id', followshipsController.unfollow)

module.exports = router