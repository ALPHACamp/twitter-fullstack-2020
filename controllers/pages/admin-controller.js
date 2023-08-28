const { User, Tweet } = require('../../models')

const adminController = {
  getAdminHomePage: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: {
          model: User,
          required: true
        },
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
        include: {
          model: User,
          required: true
        },
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
      const users = await User.findAll({
        raw: true,
        nest: true
      })

      res.render('admin/users', { users })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
