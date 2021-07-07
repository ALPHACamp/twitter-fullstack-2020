const { Tweet } = require('../models')

const tweetController = {
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
    })
    let Appear = { navbar: false, top10: false }
    return res.render('tweets', {Appear, tweets, isAuthenticated: true })
  }
}

module.exports = tweetController