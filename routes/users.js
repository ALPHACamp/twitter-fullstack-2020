const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '管理員請由後台登入')
    }
    return next()
  }
  res.redirect('/signin')
}

//user's profile
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/replies', authenticated, userController.getUserReply)
router.get('/:id/likes', authenticated, userController.getUserLike)
router.get('/:id/followers', authenticated, userController.getUserFollower)
router.get('/:id/followings', authenticated, userController.getUserFollowing)


// user's setting
router.get('/setting/:id', authenticated, userController.getUserSetting)
router.put('/setting/:id', authenticated, userController.putUserSetting)

module.exports = router