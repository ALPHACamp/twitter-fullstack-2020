const db = require('../models')
const User = db.User

const messageController = {
  getMessage: (req, res) => {
    User.findAll({
      raw: true,
      nest: true
    }).then(users => {
      return res.render('chat', { users })
    })
  }
}

module.exports = messageController