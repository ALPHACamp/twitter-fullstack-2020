const { Followship, Like, Reply, Tweet, User } = require('../models')
const tweetController = {
  getIndex: (req, res, next) => {
    res.render('tweets')
  },
  postTweet: (req, res, next) => {
  },
  getTweet: (req, res, next) => {
  },
  postLike: (req, res, next) => {
  },
  postUnlike: (req, res, next) => {
  },
  postReply: (req, res, next) => {
  }

}

module.exports = tweetController
