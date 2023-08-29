const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')

const userHelper = {
  getUserInfo: async req => {
    return await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetsCount'],
          [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${helpers.getUser(req).id}
                AND Followships.following_id = ${req.params.id}
              )`), 'isFollowed']
        ]
      },
      raw: true,
      nest: true
    })
  },
  getFollowings: async req => {
    const userId = req.params.id
    const userWithfollowings = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: 'Followings',
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            'introduction',
            [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${userId}
                AND Followships.following_id = Followings.id
              )`), 'isFollowed'] // 查看此User是否已追蹤
          ],
          through: {
            model: Followship,
            attributes: ['createdAt']
          }
        }
      ],
      order: [[{ model: User, as: 'Followings' }, { model: Followship }, 'createdAt', 'DESC']]

    })
    return userWithfollowings.toJSON()
  },
  getFollowers: async req => {
    const userId = req.params.id
    const userWithfollowers = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            'introduction',
            [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${userId}
                AND Followships.following_id = Followers.id
              )`), 'isFollowed'] // 查看此User是否已追蹤
          ],
          through: {
            model: Followship,
            attributes: ['createdAt']
          }
        }
      ],
      order: [[{ model: User, as: 'Followers' }, { model: Followship }, 'createdAt', 'DESC']]

    })
    return userWithfollowers.toJSON()
  }
}

module.exports = userHelper
