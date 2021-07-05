const express = require('express')
const router = express.Router()

const adminController = require('../controller/adminController')

module.exports = (app) => {
  app.get('/', adminController.getAdminTweets)
  app.get('/admin/tweets', adminController.getAdminTweets)
  app.get('/admin/users', adminController.getAdminUsers)
}