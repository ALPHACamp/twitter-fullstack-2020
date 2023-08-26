const { User } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../helpers/auth-helpers')
const userController = {
  getEditPage: async (req, res, next) => {
    try {
      if (req.params.id !== helpers.getUser(req)) throw new Error('沒有瀏覽權限!')
      const user = await User.findByPk(req.params.id, { raw: true })
      return res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      if (req.params.id !== helpers.getUser(req)) throw new Error('沒有編輯權限!')
      const { name, account, email, password, checkPassword } = req.body
      if (password !== checkPassword) throw new Error('密碼不相符!')
      if (name.length > 50) throw new Error('暱稱長度不可超過50個字!')

      const sameAccountUser = await User.findOne({ where: { account } })
      const sameEmailUser = await User.findOne({ where: { email } })
      if (sameEmailUser && sameEmailUser.id !== req.params.id) throw new Error('該Email已被使用!')
      if (sameAccountUser && sameAccountUser.id !== req.params.id) throw new Error('該帳號名稱已被使用!')

      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error('使用者不存在!')
      const updateInfo = {}
      if (password) {
        updateInfo.password = await bcrypt.hash(password, 10)
      }
      if (account) updateInfo.account = account
      if (name) updateInfo.name = name
      if (email) updateInfo.email = email
      await user.update(updateInfo)
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/api/users/${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
