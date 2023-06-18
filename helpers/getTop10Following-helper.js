const { User } = require('../models')
const helpers = require('../_helpers')
const getTop10Following = async (req, next) => {
  try {
    const currentUser = helpers.getUser(req)
    let users = await User.findAll({
      where: { role: 'user' },
      include: [{ model: User, as: 'Followers' }]
    })
    users = users
      .map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: currentUser.Followings.some(f => f.id === user.id)
      }))
      .sort((a, b) => b.followerCount - a.followerCount)
      .slice(0, 10)
    return users
  } catch (err) {
    next(err)
  }
}

module.exports = { getTop10Following }
