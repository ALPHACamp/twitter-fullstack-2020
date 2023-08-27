const { User, Tweet } = require('../../models')

const adminController = {
  getAdminHomePage: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User],
        raw: true,
        nest: true
      })

      tweets = tweets.map(tweet => {
        if (tweet.description.length > 50) {
          tweet.description = tweet.description.substring(0, 50) + '...'
        } else {
          tweet.description = tweet.description.substring(0, 50)
        }
        return tweet
      })

      res.render('admin/tweets', { tweets })
    } catch (error) {
      return next(error)
    }
  },

  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User],
        raw: true,
        nest: true
      })

      tweets = tweets.map(tweet => {
        if (tweet.description.length > 50) {
          tweet.description = tweet.description.substring(0, 50) + '...'
        } else {
          tweet.description = tweet.description.substring(0, 50)
        }
        return tweet
      })

      res.render('admin/tweets', { tweets })
    } catch (error) {
      return next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      res.render('admin/users')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
