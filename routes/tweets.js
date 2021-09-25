const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')

const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController')

const isAuthenticatedAdmin = (req, res, next) => {
  if (!helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    req.flash('error_messages', '只有管理員可登入後台')
  }
  res.redirect('/admin/signin')
}

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).isAdmin) {
      return next()
    }
    req.flash('error_messages', '管理員請由後台登入')
  }
  res.redirect('/signin')
}

router.get('/', authenticated, tweetController.getTweets)
router.post('/', authenticated, tweetController.postTweet)

router.get('/:id/replies', authenticated, tweetController.getTweet)
router.post('/:id/replies', authenticated, tweetController.postReply)

router.post('/:id/like', authenticated, tweetController.like)
router.post('/:id/unlike', authenticated, tweetController.unlike)

module.exports = router
