const { Tweet, User } = require('../models')

const tweetsController = {
  getTweets: async (req, res, next) => {
    // TODO: like 與 replies 數量
    try {
      const tweets = await Tweet.findAll({
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        },
        raw: true,
        nest: true
      })
      const topUsers = await User.findAll({ raw: true })
      // TODO: topUsers 尚未完成，需要根據 like 術與 follower 數相加
      return res.render('index', { tweets, topUsers })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetsController
