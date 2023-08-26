const { User, Tweet } = require('../../models')

const adminController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User],
        raw: true,
        nest: true
      })

      tweets = tweets.map(tweet => {
        if (tweet.description && tweet.description.length > 50) {
          tweet.description = tweet.description.substring(0, 50) + '...'
        }
        return tweet
      })

      res.render('admin/tweets', { tweets })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
