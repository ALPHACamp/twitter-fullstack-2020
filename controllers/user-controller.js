const jwt = require('jsonwebtoken')

const userController = {
  signInPage: (req, res, next) => {},
  signIn: (req, res, next) => {},
  signUpPage: (req, res, next) => {},
  signUp: (req, res, next) => {},
  getUserFollowings: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getUserFollowers: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getUserTweets: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getUserLikes: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getUserProfile: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postUserProfile: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postFollow: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postUnfollow: (req, res, next) => {
    res.json({ status: 'success' })
  }
}

module.exports = userController
