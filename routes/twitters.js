const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')

const twitterController = require('../controllers/twitterController.js')

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
  res.redirect('/admins/login')
}


router.get('/', authenticated, twitterController.getTwitters)
router.post('/', authenticated, twitterController.postTwitter)

router.get('/:id/replyList', authenticated, twitterController.getTwitter)
router.post('/:id/replyList', authenticated, twitterController.postReply)

router.post('/:id/like', authenticated, twitterController.like)
router.delete('/:id/unlike', authenticated, twitterController.unlike)

router.post('/:id/following', authenticated, twitterController.following)
router.delete('/:id/unfollowing', authenticated, twitterController.unfollowing)

module.exports = router
