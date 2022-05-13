const { Tweet, User, Reply, Followships, sequelize } = require('../models')
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
            { model: User, as: 'LikedUsers', attributes: ['id'] }
          ]
        })
        // User.findAll({
        //   include: [
        //     { model: User, as: 'Followers' }
        //   ],
        //   attributes: ['id', 'name', 'account',
        //     [
        //       sequelize.fn('COUNT', sequelize.col('followerId')),
        //       'followerCounts'
        //     ]
        //   ],
        //   group: 'followingId',
        //   order: [[sequelize.col('followerCounts'), 'DESC']]
        // })
      ])
      if (!user) throw new Error("User didn't exist!")
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: tweet.LikedUsers.some(item => item.id === userId)
      }))
      res.render('tweet', { user, tweets: data, followships })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
