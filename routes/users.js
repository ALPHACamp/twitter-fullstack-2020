const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).isAdmin) {
      return next()
    }
    req.flash('error_messages', '管理員請由後台登入')
  }
  res.redirect('/signin')
}

//user's profile
router.get('/:id/tweets', authenticated, userController.getUser)
router.get('/self/reply/:id', authenticated, userController.getUserReply)
router.get('/:id/likes', authenticated, userController.getUserLike)
router.get('/:id/followers', authenticated, userController.getUserFollower)
router.get('/:id/followings', authenticated, userController.getUserFollowing)
router.get('/other/:id', authenticated, userController.getOtherUser)
router.get('/otherTwitter/:id', authenticated, userController.getOtherUser)


// user's setting
router.get('/setting/:id', authenticated, userController.getUserSetting)
router.put('/setting/:id', authenticated, userController.putUserSetting)

module.exports = router