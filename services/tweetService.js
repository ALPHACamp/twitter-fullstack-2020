const { Tweet, User, Reply, Like } = require('../models')

const tweetService = {
  getTweets: async (req, res, callback) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User]
    }).then(tweets => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id)
      }))
    })
    return callback({
      tweets: data,
      Appear: { navbar: true, top10: true },
      isAuthenticated: true
    })
  },
  getTweet: async (req, res, callback) => {
    const tweet = await Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] },
        { model: User, as: 'LikedUsers' },
      ]
    }).then(tweet => {
      const isLiked = tweets.LikedUsers.map(d => d.id).includes(req.user.id)
      return callback({
        tweet: tweet,
        isLiked: isLiked,
      })
    })
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