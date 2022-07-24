const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getTweetReplies: (req, res, cb) => {

  },
  postTweetReply: (req, cb) => {

  },
  postTweetLike: (req, res) => {

  },
  postTweetsUnlike: (req, cb) => {

  },
  postTweet: (req, cb) => {

  },
  getTweets: (req, cb) => {

  }
}

module.exports = adminServices
