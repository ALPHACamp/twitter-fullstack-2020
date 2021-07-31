const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const adminController = require('../controllers/apis/adminController')
const tweetController = require('../controllers/apis/tweetController')
const userController = require('../controllers/apis/userController')


const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user.isAdmin)
    return next()
  return res.json({ status: 'error', message: 'permission denied' })
}

router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/signin', userController.signin)
router.get('/admin/tweets/:tweetsCount', tweetController.getTenTweets)

module.exports = router