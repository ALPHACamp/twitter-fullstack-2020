const helpers = require('../../_helpers')
const db = require('../../models')
const { User } = db

const userController = {
  getEditModal: async (req, res) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.userId)) {
        return res.redirect('back')
      }
      const loginUser = await User.findByPk(req.params.userId)
      return res.json(loginUser)
    } catch (err) {
      console.error(err)
    }
  },

  updateUser: async (req, res) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.userId)) {
        return res.redirect('back')
      }
      const user = await User.findByPk(req.params.userId)
      const { name, avatar, introduction, cover } = req.body
      await user.update({
        name,
        avatar,
        introduction,
        cover
      })
      return res.json({ status: 'success', message: '使用者資料編輯成功' })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
