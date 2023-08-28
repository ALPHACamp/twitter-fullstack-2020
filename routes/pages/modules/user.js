const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/pages/user-controller')
const cpUpload = require('../../../middlewares/multer')

router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/followings', userController.getFollowingUsers)
// router.get('/:/followers')
router.get('/:id', userController.getUserEditPage)
router.post('/:id', cpUpload, userController.postUserInfo)

module.exports = router
