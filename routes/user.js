const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/userController')
const authenticated = require('../middleware/auth').authenticated
const userauthenticated = require('../middleware/auth').userauthenticated

router.use(authenticated)

router.get('/:id', userauthenticated, userController.getUserPage)
router.post('/:id/edit', userauthenticated, upload.fields([{ name: 'cover' }, { name: 'avatar' }]), userController.editUserFromEditPage)
router.get('/:id/tweets', userauthenticated, userController.getUserPage)
router.get('/:id/followings', userauthenticated, userController.getUserFollowingPage)
router.get('/:id/followers', userauthenticated, userController.getUserFollowerPage)
router.get('/:id/likes', userauthenticated, userController.getUserLikesPage)
router.get('/:id/replies', userauthenticated, userController.getUserTweetsRepliesPage)
router.get('/:id/set', userauthenticated, userController.setUserPage)
router.put('/:id/set', userauthenticated, userController.setUser)
module.exports = router
