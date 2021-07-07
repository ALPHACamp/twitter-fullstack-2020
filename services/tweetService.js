const { Tweet, User, Reply } = require('../models')

const tweetService = {
  getTweets: async (req, res, callback) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User]
    })
    return callback({ tweets, isAuthenticated: true })
  },
  getTweet: async (req, res, callback) => {
    const tweet = await Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    })
    return callback({ tweet: tweet.toJSON() })
  }
}

module.exports = tweetService