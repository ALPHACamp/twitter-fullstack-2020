const db = require('../models')
const User = db.User

const adminController = {
  getUsers: (req, res) => {
    return User.findAll({ raw: true, order: [['createdAt', 'DESC']] })
      .then(users => {
        res.render('admin/users', { users })
      })
  }
}

module.exports = adminController