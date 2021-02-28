const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/userController')
const authenticated = require('../middleware/auth').authenticated

router.use(authenticated)

router.get('/:id', userController.getUserPage)
router.post('/:id/edit', upload.fields([{ name: 'cover' }, { name: 'avatar' }]), userController.editUserFromEditPage)
router.get('/:id/tweets', userController.getUserPage)
router.get('/:id/followings', userController.getUserFollowingPage)
router.get('/:id/followers', userController.getUserFollowerPage)
router.get('/:id/likes', userController.getUserLikesPage)
module.exports = router
