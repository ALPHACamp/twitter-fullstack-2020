const { User, Like } = require('../models')
const helper = require('../_helpers')

const apiServices = {
  topFollow: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
      const topFollowed = await User.findAll({
        attributes: ['id', 'name', 'account', 'avatar'],
        include: [{ model: User, as: 'Followers', attributes: ['id'] }],
        where: [{ role: 'user' }]
      })
      const topFollowedData = topFollowed.map(follow => ({
        ...follow.toJSON(),
        followerCounts: follow.Followers.length,
        isFollowed: follow.Followers.some(item => item.id === userId),
        isSelf: (userId !== follow.id)
      }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      cb(null, { topFollowed: topFollowedData })
    } catch (err) {
      cb(err)
    }
  },
  likeTweets: async (req, cb) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      if (!TweetId) throw new Error('該篇貼文不存在，請重新整理')
      const existLike = await Like.findOne({ where: { UserId, TweetId } })
      if (existLike) throw new Error('您已喜歡過該篇貼文')
      const like = await Like.create({ UserId, TweetId })
      if (!like) throw new Error('發生錯誤，請稍後再試')
      cb(null, { like })
    } catch (err) {
      cb(err)
    }
  },
  unlikeTweets: async (req, cb) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      if (!TweetId) throw new Error('該篇貼文不存在，請重新整理')
      const existLike = await Like.findOne({ where: { UserId, TweetId } })
      if (!existLike) throw new Error('您尚未喜歡該篇貼文')
      const unlike = await Like.destroy({
        where: { UserId, TweetId }
      })
      if (!unlike) throw new Error('發生錯誤，請稍後再試')
      cb(null, { unlike })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = apiServices
