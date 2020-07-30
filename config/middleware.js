const helpers = require('../_helpers')
const db = require('../models')
const User = db.User

module.exports = {
  topUsers: (req, res, next) => {
    if (helpers.getUser(req)) {
      User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })
        .then(users => {
          users = users.map(item => ({
            ...item.dataValues,
            followerCount: item.Followers.length,
            isFollowed: helpers.getUser(req).Followings.map(item => item.id).includes(item.id)
          })).filter(item => item.name !== helpers.getUser(req).name)

          helpers.getUser(req).TopUsers = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
          return helpers.getUser(req)
        })
    }
    next()
  },
  setLocals: (req, res, next) => {
    res.locals.errorMessage = req.flash('errorMessage')
    res.locals.successMessage = req.flash('successMessage')
    res.locals.user = helpers.getUser(req)
    next()
  }
}