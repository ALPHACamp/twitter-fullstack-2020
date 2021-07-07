const express = require('express')
const router = express.Router()

const adminController = require('../controller/adminController')
const tweetController = require('../controller/tweetController')

module.exports = (app) => {
  app.get('/', tweetController.getTweets)
  app.get('/admin/tweets', adminController.getAdminTweets)
  app.get('/admin/users', adminController.getAdminUsers)
  app.delete('/admin/tweets/:tweetId', adminController.deleteAdminTweet)

}