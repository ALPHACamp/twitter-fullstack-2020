const db = require('../models')
const User = db.User
const helpers = require('../_helpers')

const chatController = {
  getChat: async (req, res) => {
    try {
      const userId = req.user.id
      await User.findByPk(userId).then(userData => {
        res.render('chat', { userData: userData.toJSON() })
      })
      //const userData = req.user
    } catch (err) {
      console.log('getChat err')
      req.flash('error_messages', '公開聊天室進入失敗')
      res.redirect('back')
    }
  },
  getPrivateChat: async (req, res) => {
    try {
      const userId = req.user.id
      await User.findByPk(userId).then(userData => {
        res.render('privateChat', { userData: userData.toJSON() })
      })
      //const userData = req.user
    } catch (err) {
      console.log('getPrivateChat err')
      req.flash('error_messages', '私人聊天室進入失敗')
      res.redirect('back')
    }
  }
}

module.exports = chatController
