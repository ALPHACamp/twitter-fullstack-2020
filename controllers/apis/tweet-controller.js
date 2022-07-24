const tweetServices = require('../../services/tweet-services')
const jwt = require('jsonwebtoken')

const tweetController = {
  getTweetReplies: (req, res, next) => {
    tweetServices.getTweetReplies(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweetReply: (req, res, next) => {
    tweetServices.postTweetReply(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweetLike: (req, res, next) => {
    tweetServices.postTweetLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweetsUnlike: (req, res, next) => {
    tweetServices.postTweetsUnlike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweetUnlike: (req, res, next) => {
    tweetServices.editUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = tweetController
