const express = require('express')
const router = express.Router()

const userauthenticated = require('../../middleware/auth').userauthenticated
const userController = require('../../controllers/userController')
router.use(userauthenticated)
router.get('/:id', userController.getUserData)



module.exports = router