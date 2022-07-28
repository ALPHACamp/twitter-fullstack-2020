const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:userid/setting', userController.getSetting)
router.put('/:userid/setting', userController.putSetting)
router.get('/:userid/tweets', userController.getPersonalTweets)
router.get('/:userid/followings', userController.getPersonalFollowings)
router.get('/:userid/followers', userController.getPersonalFollowers)
router.get('/:userid/likes', userController.getPersonalLikes)
router.get('/:userid/replies', userController.getPersonalReplies)
router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
