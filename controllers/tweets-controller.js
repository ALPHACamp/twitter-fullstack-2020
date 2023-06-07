const { User, Tweet } = require('../models')

const tweetsController = {
  getTweets: async (req, res, next) => {
    try {
      const [user, tweets] = await Promise.all([
        User.findByPk(req.user.id, {
          raw: true,
          nest: true
        }),
        Tweet.findAll({
          include: User,
          order: [['createdAt', 'DESC']],
          raw: true,
          nest: true
        })
      ])
      res.render('tweets', { user, tweets })
    } catch (err) {
      next(err)
    }
  },
  getTweet: (req, res, next) => {
    return res.render('tweet')
  }
}

module.exports = tweetsController
