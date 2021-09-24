const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')

// const authenticated = (req, res, next) => {
//   if (helpers.ensureAuthenticated(req)) {
//     return next()
//   }
//   res.redirect('/users/signup')
// }

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).isAdmin) {
      return next()
    }
    req.flash('error_messages', '管理員請由後台登入')
  }
  res.redirect('/users/login')
}


router.get('/', authenticated, tweetController.getTweets)
router.post('/', authenticated, tweetController.postTweet)

router.get('/:id/replyList', authenticated, tweetController.getTweet)
router.post('/:id/replyList', authenticated, tweetController.postReply)

router.post('/:id/like', authenticated, tweetController.like)
router.delete('/:id/unlike', authenticated, tweetController.unlike)

router.post('/:id/following', authenticated, tweetController.following)
router.delete('/:id/unfollowing', authenticated, tweetController.unfollowing)

module.exports = router
