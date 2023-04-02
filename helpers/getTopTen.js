const helpers = require('../_helpers')
const { User } = require('../models')

async function getTopTen(req) {
  try {
    const users = await User.findAll(
      {
        include: { model: User, as: 'Followers' },
        where: { role: null }
      }
    )
    const topTenFollowed = users
      .map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req) && user.Followers.some(fr => fr.id === helpers.getUser(req).id),
        notSelf: helpers.getUser(req) && helpers.getUser(req).id !== user.id
      }))
      .sort((a, b) => b.followerCount - a.followerCount)
      .slice(0, 10)
    return topTenFollowed


  } catch (error) {
    console.log(error)
  }
}

module.exports = getTopTen;