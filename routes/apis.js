const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/tweetController')
const adminController = require('../controllers/adminController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const multipleUpload = upload.fields([{ name: 'avatar' }, { name: 'cover' }])

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === "normal") {
      return next()
    }
    if (helpers.getUser(req).role === "admin") {
      req.flash('error_messages', '管理者無法使用前台頁面')
      return res.redirect('/admin/tweets')
    }
  }
  req.flash('error_messages', '請先登入')
  res.redirect('/signin')
}


const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === "admin") { return next() }
    req.flash('error_messages', '請確認使用者身分')
    return res.redirect('/admin/signin')
  }
  req.flash('error_messages', '請先登入')
  res.redirect('/admin/signin')
}

router.get('/users/:user_id/followings', authenticated, userController.getUserFollowings)
// router.post('/followships/:user_id', authenticated,  userController.addFollowing)

// //使用者新增一則貼文
router.post('/tweets', tweetController.postTweets)


module.exports = router
