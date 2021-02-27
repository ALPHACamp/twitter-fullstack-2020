const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/userController')
const authenticated = require('../middleware/auth').authenticated

router.use(authenticated)

router.get('/:id/edit', userController.getUserEditPage)
router.post('/:id/edit', upload.fields([{ name: 'cover' }, { name: 'avatar' }]), userController.editUserFromEditPage)

module.exports = router
