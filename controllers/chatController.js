const db = require('../models')
const User = db.User

const helpers = require('../_helpers')


const chatController = {
  getChat: async (req, res) => {
    try {
      const userId = req.user.id
      await User.findByPk(userId).then(userData => {
         res.render('chat', {userData})
      })
      //const userData = req.user
    } catch (err) {
      consolog('getChat err')
      req.flash('error_messages', '聊天室進入失敗')
      res.redirect('back')
    }
    
  }
}









module.exports = chatController