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
  }
}

module.exports = messageController