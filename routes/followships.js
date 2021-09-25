const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')

const followshipController = require('../controllers/followshipController.js')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).role === 'admin') {
      return next()
    }
    req.flash('error_messages', '管理員請由後台登入')
  }
  res.redirect('/signin')
}

router.post('/', authenticated, followshipController.following)
router.delete('/:id', authenticated, followshipController.unfollowing)

module.exports = router