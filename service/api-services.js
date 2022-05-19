const { User } = require('../models')
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
  }
}

module.exports = apiServices
