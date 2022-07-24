const tweetServices = require('../../services/tweet-services')
const jwt = require('jsonwebtoken')

const tweetController = {
  getTweetReplies: (req, res, next) => {
    userServices.getTweetReplies(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweetReply: (req, res, next) => {
    userServices.postTweetReply(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweetLike: (req, res, next) => {
    userServices.postTweetLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweetsUnlike: (req, res, next) => {
    userServices.postTweetsUnlike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweetUnlike: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postTweet: (req, res, next) => {
    userServices.postTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTweets: (req, res, next) => {
    userServices.getTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = tweetController
