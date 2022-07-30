const { User } = require('../models')

const getTopUser = async currentUser => {
  let topUser = await User.findAll({
    include: [{ model: User, as: 'Followers' }]
  })
  topUser = topUser
    .map(user => ({
      ...user.toJSON(),
      followerCount: user.Followers.length,
      isFollowed: currentUser.Followings.some(f => f.id === user.id)
    }))
    .sort((a, b) => b.followerCount - a.followerCount)
  return topUser
}

module.exports = getTopUser
