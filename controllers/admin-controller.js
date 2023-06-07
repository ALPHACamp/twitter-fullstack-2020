const { User } = require('../models')

const adminController = {
  getTweets: (req, res, next) => {
    res.render('admin/admin-tweets')
  },

  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => {
        res.render('admin/admin-users', { users })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
