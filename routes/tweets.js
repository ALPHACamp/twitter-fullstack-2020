const router = require('express').Router()
const tweetsController = require('../controllers/tweetsController')
const helpers = require('../_helpers')

const checkRole = (req, res, next) => {
  if (helpers.getUser(req).role !== 'admin') {
    return next()
  }
  return res.redirect('/admin/tweets')
}

router.get('/', checkRole,tweetsController.allTweets)

router.get('/:id/top10', checkRole, tweetsController.getTop10Twitters)

router.get('/:id/replies', checkRole, tweetsController.getTweetReplies)

router.post('/', checkRole, tweetsController.postTweet)

router.post('/:id/like', checkRole, tweetsController.postLike)

router.post('/:id/unlike', checkRole, tweetsController.postUnlike)

router.post('/:id/replies', checkRole, tweetsController.postTweetReply)

module.exports = router