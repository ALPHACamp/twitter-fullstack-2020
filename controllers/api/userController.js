const helpers = require('../../_helpers')
const db = require('../../models')
const { User } = db

const userController = {
  getEditModal: async (req, res) => {
    if (helpers.getUser(req) !== Number(req.params.userId)) {
      return res.end()
    }
    const loginUser = await User.findByPk(req.params.userId)
    return res.json(loginUser)
  }
}

module.exports = userController
