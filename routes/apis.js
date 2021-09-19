const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const helpers = require('../_helpers')

const userController = require('../controllers/api/userController')
const tweetController = require('../controllers/api/tweetController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  return res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role) return next()
    return res.redirect('/')
  }
  return res.redirect('/signin')
}

router.get('/tweets/:tweetId/replies', authenticated, tweetController.getModalTweet)



router.get('/users/:userId', authenticated, userController.getUser)











module.exports = router