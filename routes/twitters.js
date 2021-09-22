const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')

const twitterController = require('../controllers/twitterController.js')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/users/login')
}


router.get('/', authenticated, twitterController.getTwitters)

module.exports = router