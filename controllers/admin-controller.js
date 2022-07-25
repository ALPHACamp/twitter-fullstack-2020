const jwt = require('jsonwebtoken')

const adminController = {
  getUsers: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getTweets: (req, res, next) => {
    res.json({ status: 'success' })
  },
  deleteTweet: (req, res, next) => {
    res.json({ status: 'success' })
  },
  adminSignIn: (req, res, next) => {
    res.json({ status: 'success' })
  }
}

module.exports = adminController
