const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/userController')
const authenticated = require('../middleware/auth').authenticated
const userauthenticated = require('../middleware/auth').userauthenticated
const getUser = require('../middleware/auth').getUser

router.use(authenticated)
router.use(userauthenticated)

router.get('/:id', getUser, userController.getUserPage)
router.post('/:id/edit', upload.fields([{ name: 'cover' }, { name: 'avatar' }]), userController.editUserFromEditPage)
router.get('/:id/tweets', getUser, userController.getUserPage)
router.get('/:id/followings', getUser, userController.getUserFollowingPage)
router.get('/:id/followers', getUser, userController.getUserFollowerPage)
router.get('/:id/likes', getUser, userController.getUserLikesPage)
router.get('/:id/replies', getUser, userController.getUserTweetsRepliesPage)
router.get('/:id/set', getUser, userController.setUserPage)
router.put('/:id/set', userController.setUser)
module.exports = router
