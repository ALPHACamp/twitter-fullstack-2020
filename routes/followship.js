const express = require('express')
const router = express.Router()
const authenticated = require('../middleware/auth').authenticated
const userController = require('../controllers/userController')
const userauthenticated = require('../middleware/auth').userauthenticated

router.use(authenticated)

router.post('/', userauthenticated, userController.addFollowing)
router.delete('/:id', userauthenticated, userController.removeFollowing)

module.exports = router