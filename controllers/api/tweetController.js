const tweetService = require('../../services/tweetService')

const tweetController = {
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },
  getTweet: (req, res) => {
    tweetService.getTweet(req, res, (data) => {
      return res.json(data)
    })
  },
  postTweet: (req, res) => {
    tweetService.postTweet(req, res, (data) => {
      return res.json(data)
    })
  },
  postReply: (req, res) => {
    tweetService.postReply(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = tweetController