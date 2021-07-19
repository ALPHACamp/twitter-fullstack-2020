const { User, Publicmsg } = require('../models')

const messageController = {
  getPublic: async (req, res) => {
    try {
      const msg = await Publicmsg.findAll({
        include: [User],
        order: [['createdAt']],
        raw: true,
        nest: true
      })
      return res.render('public', { msg })
    } catch (error) {
      console.warn(error)
    }
  }
}

module.exports = messageController