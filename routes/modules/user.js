const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const apiUserController = require('../../controllers/api/user-controller')

router.get('/:id/setting', apiUserController.getSetting)
router.put('/:id/setting', apiUserController.putSetting)
router.get('/:id/tweets', userController.getPersonalTweets)
router.get('/:id/followings', userController.getPersonalFollowings)
router.get('/:id/followers', userController.getPersonalFollowers)
router.get('/:id/likes', userController.getPersonalLikes)
router.get('/:id/replies', userController.getPersonalReplies)
router.use('/', (req, res) => res.redirect('/tweets'))

module.exports = router
