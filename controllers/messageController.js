const db = require('../models')
const User = db.User
const Message = db.Message

const messageController = {
  getMessage: (req, res) => {
    Message.findAll({
      raw: true,
      nest: true
    }).then(messages => {
      const loginUser = req.user
      return res.render('chat', { messages, loginUser })
    })
  },

  getPrivateMessage: (req, res) => {
    return res.render('privateChat')
  }
}

module.exports = messageController