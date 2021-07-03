const express = require('express')
const router = express.Router()

const adminController = require('../controller/adminController')

module.exports = (app) => {
  app.get('/', adminController.getAdminTweets)
}