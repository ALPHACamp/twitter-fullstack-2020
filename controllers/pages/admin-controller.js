const { User, Tweet } = require('../../models')

const adminController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [User]
      })
      res.render('admin/tweets', { tweets: tweets.map(tweet => tweet.toJSON()) })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
