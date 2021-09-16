const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const twitterController = require('../controllers/twitterController.js')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated) {
    return next()
  }
  res.redirect('/users/signup')
}

router.get('/', twitterController.getTwitters)


module.exports = router