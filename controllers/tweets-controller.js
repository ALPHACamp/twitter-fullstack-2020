const { User, Tweet } = require('../models')
const helpers = require('../_helpers')
const tweetsController = {
  getTweets: async (req, res, next) => {
    const UserId = helpers.getUser(req).id
    try {
      const [user, tweets] = await Promise.all([
        User.findByPk(UserId, {
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
  },
  postTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('推文內容不能為空白!')
    try {
      await Tweet.create({
        UserId,
        description
      })
      res.redirect('tweets')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetsController
