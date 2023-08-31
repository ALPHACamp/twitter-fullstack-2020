const { User } = require('../models')
const helpers = require('../_helpers')

const apiController = {
  getUser: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req).id
      const UserId = Number(req.params.id)
      const user = await User.findByPk(UserId)

      if (currentUser !== UserId) throw new Error('無法觀看編輯其他使用者資料！')
      res.json(user.toJSON())
    } catch (err) {
      req.flash('error_messages', err.message)
      res.json({ status: 'error', message: err.message })
      next(err)
    }
  }
}

module.exports = apiController
