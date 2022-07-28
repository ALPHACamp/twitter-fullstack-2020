const { sequelize, User, Followship } = require('../models')
const { getUser } = require('../_helpers')

module.exports = {
  getRecommendedUsers: (req, res, next) => {
    Followship.findAll({
      include: User,
      group: 'followingId',
      attributes: {
        include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
      },
      order: [[sequelize.literal('count'), 'DESC']]
    })
      .then(followship => {
        const loginUser = getUser(req)
        const recommendedUsers = followship
          .map(data => {
            return {
              followingCount: data.dataValues.count,
              ...data.User.toJSON(),
              isFollowed: loginUser.Followings.some(u => u.id === data.followingId)
            }
          })
          .slice(0, 10)
        res.locals.recommendedUsers = recommendedUsers
        next()
      })
      .catch(err => next(err))
  }
}
