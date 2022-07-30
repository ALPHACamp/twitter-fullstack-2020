const { User } = require('../models')

const getTopUser = async currentUser => {
  try {
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
  } catch (err) {
    console.log(err)
  }
}

module.exports = getTopUser
