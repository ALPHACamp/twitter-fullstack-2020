const helpers = require('../../_helpers')
const db = require('../../models')
const { User } = db

const userController = {
  getEditModal: async (req, res) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.userId)) {
        return res.json({ status: 'error', message: '你無權查看此頁面' })
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
        return res.json({ status: 'error', message: '你無權查看此頁面' })
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
