const { User, Publicmsg } = require('../models')

const messageController = {
  getPublic: (req, res) => {
    return Publicmsg.findAll({
      include: [User],
      raw: true
    }).then(msg => {
      return res.render('public', { msg })
    })
  }
}

module.exports = messageController