const { Tweet } = require('../models')

const tweetController = {
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
    })

    return res.render('tweets', { tweets, isAuthenticated: true })
  }
}

module.exports = tweetController