const { Tweet, User, Reply, Like } = require('../models')

const tweetService = {
  getTweets: async (req, res, callback) => {
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        User,
        { model: User, as: 'LikedUsers' }
      ]
    })
    tweets = tweets.map(t => ({
      ...t.dataValues,
      User: t.User.dataValues,
      LikedCount: t.LikedUsers.length,
      isLiked: req.user.LikedTweets.map(t => t.id).includes(t.dataValues.id)
    }))
    return callback({
      tweets,
      Appear: { navbar: true, top10: true },
    })
  },
  getTweet: async (req, res, callback) => {
    const tweet = await Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    })
    return callback({ tweet: tweet.toJSON() })
  },
  postTweet: async (req, res, callback) => {
    if (!req.body.description) {
      return callback({ status: 'error', message: 'description empty!' })
    }
    await Tweet.create({
      UserId: req.user.id,
      description: req.body.description
    })
    return callback({ status: 'success', message: 'tweet has been created successfully!' })
  }
}

module.exports = tweetService