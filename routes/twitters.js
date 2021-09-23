const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')

const twitterController = require('../controllers/twitterController.js')
const userController = require('../controllers/userController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/users/login')
}


router.get('/', authenticated, twitterController.getTwitters)
router.post('/', authenticated, twitterController.postTwitter)

router.get('/:id/replyList', authenticated, twitterController.getTwitter)
router.post('/:id/replyList', authenticated, twitterController.postReply)

router.post('/:id/like', authenticated, twitterController.like)
router.delete('/:id/unlike', authenticated, twitterController.unlike)

module.exports = router
