const db = require('../models')
const helpers = require('../_helpers')
const User = db.User

const chatController = {
  getChat: async (req, res) => {
    try {
      const currentUser = await User.findByPk(helpers.getUser(req).id)
      res.render('chat', { currentUser: currentUser.toJSON()})
    } catch (err) {
      console.warn(err)
    }
  }




}









module.exports = chatController