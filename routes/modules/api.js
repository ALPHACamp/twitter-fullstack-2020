const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')

const apiController = require('../../controllers/api-controller')

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.get('/users/:id', apiController.getUser)
router.post('/users/:id', cpUpload, apiController.postUser)

router.use('/', (req, res) => res.redirect('/admin/signin'))

module.exports = router
