const { User } = require('../models')
const userController = {
  getUsers: (req, res) => {
    return res.render('users')
  },
  getSetting: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('setting', { user })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
