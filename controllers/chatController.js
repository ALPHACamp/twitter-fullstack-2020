const { Op } = require('sequelize')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')

const chatController = {
  getChat: async (req, res) => {
    try {
      const userId = req.user.id
      const userData = await User.findByPk(userId)

      res.render('chat', { userData: userData.toJSON() })
    } catch (err) {
      console.log('getChat err')
      req.flash('error_messages', '公開聊天室進入失敗')
      res.redirect('back')
    }
  },
  getPrivateChatPage: async (req, res) => {
    try {
      const userId = req.user.id
      const userList = await User.findAll({
        where: { id: { [Op.not]: userId } },
        raw: true,
        nest: true
      })
      const userData = await User.findByPk(userId)
      res.render('privateChat', { userData: userData.toJSON(), userList })

    } catch (err) {
      console.log('getPrivateChat err')
      req.flash('error_messages', '私人聊天室進入失敗')
      res.redirect('back')
    }
  },
  getPrivateChat: async (req, res) => {
    try {
      const userId = req.user.id
      const receiverId = req.params.receiverId
      const userList = await User.findAll({
        where: { id: { [Op.not]: userId } },
        raw: true,
        nest: true
      })
      const userData = await User.findByPk(userId)
      const receiverData = await User.findByPk(receiverId)
      res.render('privateChat', {
        userData: userData.toJSON(),
        userList,
        receiverData : receiverData.toJSON(),
      })

    } catch (err) {
      console.log('getPrivateChat err')
      req.flash('error_messages', '私人聊天室進入失敗')
      res.redirect('back')
    }
  }
}

module.exports = chatController
