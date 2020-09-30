const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../contollers/apis/adminController')
const tweetController = require('../contollers/apis/tweetController')
const userController = require('../contollers/apis/userController')


const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user.isAdmin)
    return next()
  return res.json({ status: 'error', message: 'permission denied' })
}

router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/signin', userController.signin)

module.exports = router