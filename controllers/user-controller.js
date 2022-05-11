const { User, Tweet, Reply, Like, Followship } = require('../models')

const { imgurFileHandler } = require('../_helpers')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      res.render('signup', { users })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const [user, tweets] = await Promise.all([
        User.findByPk(userId, { raw: true }),
        Tweet.findAll({ where: { userId }, raw: true }),
      ])

      res.render('user', { user, tweets })
    } catch (err) {
      next(err)
    }
  },
}

module.exports = userController
