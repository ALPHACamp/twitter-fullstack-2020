const tweetService = require('../services/tweetService')

const tweetController = {

  getTweets: (req, res) => {
    tweetService.getTweets(req, res, (data) => {
      return res.render('tweets', data)
    })
  }
}

module.exports = tweetController