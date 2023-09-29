const helpers = require('../_helpers')
const { Op } = require('sequelize')
const db = require('../models')
const { User } = db

const getTopUsers = (req, res, next) => {
  const currentUser = helpers.getUser(req)
  return User.findAll({
    where: {
      id: { [Op.ne]: Number(currentUser.id) },
      role: { [Op.ne]: 'admin' }
    },
    include: [
      { model: User, as: 'Followers' }
    ]
  })
    .then(userAndFollowers => {
      const userAndFollowersList = userAndFollowers
        .map(element => ({
          ...element.toJSON(),
          account: element.account.length < 11 ? '@' + element.account : '@' + element.account.substring(0, 7) + ' ...',
          name: element.name.length < 10 ? element.name : element.name.substring(0, 6) + ' ...',
          followByMe: element.Followers.some(follower => follower.id === currentUser.id),
          followersCount: element.Followers.length
        })
        )
        .sort((a, b) => b.followersCount - a.followersCount)
      req.topFollowingsList = userAndFollowersList.slice(0, 10)
      return next()
    }
    )
}

module.exports = {
  getTopUsers
}
