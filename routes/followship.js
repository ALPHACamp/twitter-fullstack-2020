const express = require('express')
const router = express.Router()
const authenticated = require('../middleware/auth').authenticated
const userController = require('../controllers/userController')

router.use(authenticated)

router.post('/', userController.addFollowing)
router.delete('/:id', userController.removeFollowing)

module.exports = router