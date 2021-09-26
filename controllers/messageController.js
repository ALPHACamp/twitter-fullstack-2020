const db = require('../models')
const PublicMsg = db.PublicMsg
const User = db.User

const messageController = {
  getPublic: async (req, res) => {
    const allMsg = await PublicMsg.findAll({
      order: [['createdAt', 'ASC']],
      include: [
        User
      ],
      raw: true,
      nest: true,
    })
    const user = req.user
    res.render('publicChat', {user:user, allMsg: allMsg})
  }
}

module.exports = messageController