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
        Tweet.findAll({
          include: [Reply],
          where: { userId }
        })
      ])
      if (!user) throw new Error("User didn't exist!")

      const data = tweets.map(tweet => ({
        ...tweet.toJSON()
      }))

      res.render('user', { user, tweets: data, tab: 'getTweets' })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const userId = req.params.id

      const [user, replies] = await Promise.all([
        User.findByPk(userId, { raw: true }),
        Reply.findAll({
          where: { userId },
          include: [{ model: Tweet, include: User }]
        })
      ])
      if (!user) throw new Error("User didn't exist!")

      const data = replies.map(reply => ({
        ...reply.toJSON()
      }))

      res.render('user', { user, replies: data, tab: 'getReplies' })
    } catch (err) {
      next(err)
    }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Tweet,
            as: 'LikedTweets',
            include: [User, Reply, { model: User, as: 'LikedUsers' }]
          }
        ]
      })
      if (!user) throw new Error("User didn't exist!")

      res.render('user', { user: user.toJSON(), tab: 'getLikedTweets' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
