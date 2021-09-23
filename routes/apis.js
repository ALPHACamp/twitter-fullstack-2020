const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role !== 'admin') {
      return next()
    }
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '管理者無法使用前台頁面')
      return res.redirect('/admin/tweets')
    }
  }
  req.flash('error_messages', '請先登入')
  res.redirect('/signin')
}

//追蹤使用者
router.post('/followships/:id', authenticated, userController.addFollowing)

//顯示所有貼文
router.get('/tweets', authenticated, tweetController.getTweets)

//使用者新增一則貼文
router.post('/tweets', authenticated, tweetController.postTweets)

//使用者顯示特定使用者頁面(使用者所有貼文)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)

//render edit page (modal)
router.get('/users/:id', authenticated, userController.renderUserEdit)

//update edit page (modal)
router.post('/users/:id', authenticated, userController.putUserEdit)

module.exports = router
