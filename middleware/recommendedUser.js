const { User } = require('../models')
const { getUser } = require('../_helpers')

module.exports = {
  getRecommendedUsers: (req, res, next) => {
    User.findAll({
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        const loginUser = getUser(req)
        console.log(users)
        const recommendedUsers = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: loginUser?.Followings.map(f => f.id).includes(user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, 10)
          .filter(user => user.role !== 'admin')
        res.locals.recommendedUsers = recommendedUsers
        next()
      })
      .catch(err => next(err))
  }
}
