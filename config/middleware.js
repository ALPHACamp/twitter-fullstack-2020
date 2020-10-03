const helper = require('../_helpers')
const db = require('../models')
const User = db.User

module.exports = {
  TopUsers: (req, res, next) => {
    if (helper.getUser(req)) {
      return User.findAll({
        where: { isAdmin: '0' }
      })
        .then((users) => {
          let data = users.map((u) => ({
            ...u.dataValues
          }))
          console.log(data)
        })
    }
    next()
  }

}