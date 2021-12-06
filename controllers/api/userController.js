const helpers = require('../../_helpers')
const db = require('../../models')
const { User } = db

const userController = {
  getEditModal: async (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.userId)) {
      return res.redirect('back')
    }
    const loginUser = await User.findByPk(req.params.userId)
    return res.json(loginUser)
  }
}

module.exports = userController
