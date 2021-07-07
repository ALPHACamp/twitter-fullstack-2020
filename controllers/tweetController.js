const { Tweet, User, Reply } = require('../models')

const tweetService = require('../services/tweetService')

const tweetController = {
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.render('tweets', data)
    })
  },
  getTweet: async (req, res) => {
    tweetService.getTweet(req, res, (data) => {
      return res.render('tweet', data)
    })
  }
}

module.exports = tweetController