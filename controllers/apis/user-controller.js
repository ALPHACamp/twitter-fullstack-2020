const { User } = require('../../models')
const helpers = require('../../_helpers')
const { imgurFileHandler } = require('../../helpers/file-helpers')

const apiController = {
  getUserInfo: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const UserId = req.params.id
      const user = await User.findOne({
        where: { id: UserId }
      })
      if (currentUser.id !== user.id) {
        return res.json({ status: 'error', messages: '無法編輯其他使用者資料！' })
      }
      res.json(user.toJSON())
    } catch (err) {
      next(err)
    }
  },
  postUserInfo: async (req, res, next) => {

  }
}

module.exports = apiController
