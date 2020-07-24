const db = require('../models')
const User = db.User

module.exports = {
  topUsers: (req, res, next) => {
    if (req.user) {
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
        .then(users => {
          users = users.map(item => ({
            ...item.dataValues,
            followerCont: item.Followers.length,
            isFollowed: req.user.Followings.map(item => item.id).includes(item.id)
          }))
          req.user.TopUsers = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
          return req.user
        })
    }
    next()
  },
  setLocals: (req, res, next) => {
    res.locals.errorMessage = req.flash('errorMessage')
    res.locals.successMessage = req.flash('successMessage')
    res.locals.user = req.user
    next()
  }
}