const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const tweetController = require('../controllers/api/tweetController.js')
const userController = require('../controllers/api/userController.js')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!(helpers.getUser(req).role === "admin")) {
      return next()
    }
    else {
      req.flash('error_messages', '此帳號無前台權限，跳轉至後台')
      return res.redirect('/admin/tweets')
    }
  }
  return res.redirect('/signin')
}

const multipleUpload = upload.fields([{ name: 'avatar' }, { name: 'cover' }])

// Follow
router.post('/followships/:id', authenticated, userController.addFollowing)

// 使用者新增推文
router.post('/tweets', authenticated, tweetController.postTweets)

// 取得特定使用者的推文
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)

// Profile - Edit
router.get('/users/:id', authenticated, userController.renderUserProfileEdit)
router.post('/users/:id', authenticated, multipleUpload, userController.putUserProfileEdit)

module.exports = router