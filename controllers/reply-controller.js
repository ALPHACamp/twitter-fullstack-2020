const { Tweet, User, Reply } = require('../models')
const helper = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const userId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      const [tweet, replies, followships] = await Promise.all([
        Tweet.findOne({
          where: { id: TweetId },
          attributes: ['id', 'description', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: User, as: 'LikedUsers', attributes: ['id'] }
          ]
        }),
        Reply.findAll({
          where: { TweetId },
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
        }),
        User.findAll({
          attributes: ['id', 'name', 'account', 'avatar'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          where: [{ role: 'user' }]
        })
      ])
      if (!tweet) throw new Error('此篇貼文不存在')

      const tweetData = {
        ...tweet.toJSON(),
        isLiked: tweet.LikedUsers.some(item => item.id === userId)
      }

      const repliesData = replies.map(reply => ({
        ...reply.toJSON()
      }))

      const followshipData = followships.map(followship => ({
        ...followship.toJSON(),
        followerCounts: followship.Followers.length,
        isFollowed: followship.Followers.some(item => item.id === userId),
        isSelf: (userId !== followship.id)
      }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      res.render('reply', { tweet: tweetData, replies: repliesData, followships: followshipData })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
