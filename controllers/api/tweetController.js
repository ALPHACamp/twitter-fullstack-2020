const tweetService = require('../../services/tweetService.js')

const tweetController = {

  getTweets: (req, res) => {
    tweetService.getTweets(req, res, data => {
      return res.json(data)
    })
  },

  postTweets: (req, res) => {
    tweetService.postTweets(req, res, (data) => { return res.status(200).json(data) })
  }
}

module.exports = tweetController