const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')



router.get('/users/:id', authenticated, apiController.getUser)
router.post('/users/:id', upload.fields([{name: 'cover', maxCount: 1}, {name: 'avatar', maxCount: 1}]), authenticated, apiController.putUser)

module.exports = router