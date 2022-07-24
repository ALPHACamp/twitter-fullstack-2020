const userServices = require('../../services/admin-services')
const jwt = require('jsonwebtoken')

const adminController = {
  getUsers: (req, res, next) => {
    userServices.getUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTweets: (req, res, next) => {
    userServices.getTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteTweet: (req, res, next) => {
    userServices.deleteTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  adminSignIn: (req, res, next) => {
    userServices.adminSignIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = adminController
