const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers');

const userController = require('../controllers/userController')
const authenticated = require('../middleware/auth').authenticated
const userauthenticated = require('../middleware/auth').userauthenticated
const getSign = require('../middleware/auth').getSign

router.use(authenticated)
router.use(userauthenticated)

router.get('/:id', userController.getUserPage)
router.post('/:id/edit', getSign, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.editUserFromEditPage)
router.get('/:id/tweets', userController.getUserPage)
router.get('/:id/followings', userController.getUserFollowingPage)
router.get('/:id/followers', userController.getUserFollowerPage)
router.get('/:id/likes', userController.getUserLikesPage)
router.get('/:id/replies', userController.getUserTweetsRepliesPage)

router.get('/:id/set', getSign, userController.setUserPage)
router.put('/:id/set', getSign, userController.setUser)


module.exports = router
