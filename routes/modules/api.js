const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')

router.get('/:id', apiController.editUser)
router.post('/:id', apiController.putUser)

module.exports = router
