const { User, sequelize } = require('../models')

const userHelper = {
  getUserInfo: async req => {
    return await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount']
        ]
      },
      raw: true
    })
  }
}

module.exports = userHelper
