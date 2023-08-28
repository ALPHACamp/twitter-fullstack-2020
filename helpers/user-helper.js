const { User, Followship, sequelize } = require('../models')

const userHelper = {
  getUserInfo: async req => {
    return await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetsCount']
        ]
      },
      raw: true
    })
  },
  getFollowingUsers: async req => {
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
                AND Followships.following_id = User.id
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
  }
}

module.exports = userHelper
