const express = require('express')
const router = express.Router()
const helpers = require('../../_helpers')

const tweetController = require('../../controllers/tweetController')


const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    return next()
  }
  res.redirect('/signin')
}

// tweets
router.get('/', authenticated, tweetController.getTweets)

router.get('/:tweetId/replies', authenticated, tweetController.getTweet)
router.post('/', authenticated, tweetController.addTweet)
router.post('/:tweetId/replies',authenticated,tweetController.postReplies)

// tweets like
router.post('/:tweetId/like', authenticated, tweetController.addLike)
router.post('/:tweetId/unlike',authenticated,tweetController.removeLike)


module.exports = router
