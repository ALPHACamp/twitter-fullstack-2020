const { Tweet, User, Reply, Like } = require('../models')

const userService = {
  getUserTweets: async (req, res, callback) => {
    let tweets = await Tweet.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ]
    })
    tweets = tweets.map(tweet => {
      return {
        ...tweet.dataValues,
        User: tweet.User.dataValues,
        RepliesCount: tweet.Replies.length,
        LikedCount: tweet.LikedUsers.length,
        isLiked: req.user.LikedTweets.map(tweet => tweet.id).includes(tweet.dataValues.id)
      }
    })
    return callback({
      tweets,
      Appear: { navbar: true, top10: true }
    })
  }
}

module.exports = userService