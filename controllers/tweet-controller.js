const jwt = require('jsonwebtoken')

const tweetController = {
  getTweetReplies: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweetReply: (req, res, next) => {
    res.json({ status: 'success' })
  },
  likeTweet: (req, res, next) => {
    res.json({ status: 'success' })
  },
  unlikeTweet: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweetUnlike: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweet: (req, res, next) => {
    res.json({ status: 'success' })
  },
  getTweets: (req, res, next) => {
    res.json({ status: 'success' })
  }
}

module.exports = tweetController
