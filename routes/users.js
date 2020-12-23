const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/:id/followers', userController.getFollowers)

// -----------------------------------------------------------------------------------

router.get('/:id/tweets', userController.getUser)
router.put('/:id/tweets', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.get('/:id/edit', userController.getEdit)
router.put('/:id', userController.putUserInfo)

// -----------------------------------------------------------------------------------

module.exports = router
