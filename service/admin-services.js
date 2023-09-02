const { User, Tweet, sequelize } = require('../models')
const pagiHelper = require('../helpers/pagination-helpers')
const { relativeTimeFromNow } = require('../helpers/handlebars-helpers')

const adminServices = {
  getTweets: async (limit = 10, page = 0) => {
    const offset = pagiHelper.getOffset(limit, page)
    const tweets = await Tweet.findAll({
      include: {
        model: User,
        required: true
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      offset,
      limit
    })

    return tweets.map(tweet => {
      tweet.createdAt = relativeTimeFromNow(tweet.createdAt)
      if (tweet.description.length > 50) {
        tweet.description = tweet.description.substring(0, 50) + '...'
      } else {
        tweet.description = tweet.description.substring(0, 50)
      }
      return tweet
    })
  },
  getUsers: async (limit = 8, page = 0) => {
    const offset = pagiHelper.getOffset(limit, page)
    return await User.findAll({
      // 使用者需要看到所有用戶，包含root帳號
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'role',
        'cover',
        [sequelize.literal('( SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetCount'],
        [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
        [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
        [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.user_id = User.id)'), 'likeCount']
      ],
      order: [['tweetCount', 'DESC']],
      raw: true,
      limit,
      offset
    })
  }
}

module.exports = adminServices
