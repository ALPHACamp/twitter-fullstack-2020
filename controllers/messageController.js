const db = require('../models')
const User = db.User
const Message = db.Message
const { Op } = require("sequelize")

const messageController = {
  getMessage: (req, res) => {
    Message.findAll({
      raw: true,
      nest: true
    }).then(messages => {
      let public = true
      const loginUser = req.user
      return res.render('chat', { messages, loginUser, public })
    })
  },

  getPrivateMessage: (req, res) => {
    console.log(req.user.id)
    console.log(req.params.userId)
    Message.find({
      where: {
        [Op.or]: [
          { messageToId: req.user.id,
          messageFromId: req.params.userId },
          { messageToId: req.params.userId,
            messageFromId: req.user.id }
        ]
      }
    }).then(messages =>{
      console.log(messages)
      const loginUser = req.user
      return res.render('chat', { messages, loginUser })
    })
  }
}

module.exports = messageController