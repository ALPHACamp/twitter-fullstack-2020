const router = require('express').Router()
const usersController = require('../controllers/usersController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

const checkRole = (req, res, next) => {
  if (helpers.getUser(req).role !== 'admin') {
    return next()
  }
  return res.redirect('/admin/tweets')
}

router.get('/:id', checkRole, usersController.getUser)

router.get('/:id/tweets', checkRole, usersController.getUserTweets)

router.get('/:id/replies', checkRole, usersController.getUserReplies)

router.get('/:id/likes', checkRole, usersController.getUserLikes)

router.get('/:id/followings', checkRole, usersController.getUserFollowings)

router.get('/:id/followers', checkRole, usersController.getUserFollowers)

router.put('/:id', checkRole, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), usersController.editUserData)

module.exports = router