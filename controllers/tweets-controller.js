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
      const partialName = 'tweets'
      res.render('index', { user, tweets, partialName })
    } catch (err) {
      next(err)
    }
  },
  getTweet: (req, res, next) => {
    const partialName = 'tweet'
    return res.render('index', { partialName })
  }
}

module.exports = tweetsController
