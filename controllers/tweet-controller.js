const { Tweet, User, Reply } = require('../models')
const helper = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const userId = helper.getUser(req).id
      const [user, tweets, followships] = await Promise.all([
        User.findByPk(userId,
          {
            attributes: ['id', 'name', 'avatar'],
            raw: true
          }),
        Tweet.findAll({
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'description', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: User, as: 'LikedUsers' }
          ]
        }),
        User.findAll({
          attributes: ['id', 'name', 'account', 'avatar'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          where: [{ role: 'user' }]
        })
      ])

      const followshipData = followships.map(followship => ({
        ...followship.toJSON(),
        followerCounts: followship.Followers.length,
        isFollowed: followship.Followers.some(item => item.id === userId),
        isSelf: (userId !== followship.id)
      }))
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)
      if (!user) throw new Error("User didn't exist!")
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: tweet.LikedUsers.some(item => item.id === userId)
      }))
      res.render('tweet', { user, tweets: data, followships: followshipData })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
