const { use } = require('chai')
const express = require('express')
const router = express.Router()

const adminController = require('../controller/adminController')
const userController = require('../controller/userController')

module.exports = (app) => {
  app.get('/', adminController.getAdminTweets)
  app.get('/admin/tweets', adminController.getAdminTweets)

  app.get('/users/:userId/tweets', userController.getUserTweets)
}