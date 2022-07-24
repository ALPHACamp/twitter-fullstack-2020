const userServices = require('../../services/user-services')
const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {

  },
  signUp: (req, res, next) => {

  },
  getUserFollowings: (req, res, next) => {
    userServices.getUserFollowings(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserFollowers: (req, res, next) => {
    userServices.getUserFollowers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserLikes: (req, res, next) => {
    userServices.getUserLikes(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserProfile: (req, res, next) => {
    userServices.getUserProfile(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postUserProfile: (req, res, next) => {
    userServices.postUserProfile(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postFollow: (req, res, next) => {
    userServices.postUserProfile(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postUnfollow: (req, res, next) => {
    userServices.postUserProfile(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = userController
