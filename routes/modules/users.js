const express = require('express')
const router = express.Router()
const helpers = require('../../_helpers')

const userController = require('../../controllers/userController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    return next()
  }
  res.redirect('/signin')
}

//users setting
router.get('/:userId/setting', authenticated, userController.getSetting)
router.put('/:userId/setting', authenticated, userController.editSetting)

//users follow
router.get('/:userId/followings',authenticated,userController.getFollowings)
router.get('/:userId/followers',authenticated,userController.getFollowers)

//users pages
router.get('/:userId/tweets', authenticated, userController.getUserTweets)
router.get('/:userId/replies', authenticated, userController.getReplies)
router.get('/:userId/likes', authenticated, userController.getLikes)



module.exports = router
