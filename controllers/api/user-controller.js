// 登入、註冊、登出、拿到編輯頁、送出編輯
const assert = require('assert')
const bcrypt = require('bcryptjs')
const { User } = require('../../models')
const helpers = require('../../_helpers')

const userController = {
  getSetting: async (req, res, next) => {
    try {
      const user = await User.findByPk(Number(req.params.id), { raw: true })
      if (user.id !== helpers.getUser(req).id) return res.json({ status: 'error' })
      return res.json(user)
    }
    catch (err) {
      next(err)
    }
  },
  putSetting: async (req, res, next) => {
    try {
      const user = await User.findByPk(Number(req.params.id))
      const { account, name, email, password, checkPassword } = req.body
      const errors = []
      if (password !== checkPassword) {
        errors.push({ message: '密碼與確認密碼不相符！' })
      }
      if (name?.length > 50 && account?.length > 50) {
        errors.push({ message: '字數超出上限！' })
      }
      const userEmail = await User.findOne({
        where: { ...email ? { email } : {} },
        raw: true
      })
      const userName = await User.findOne({
        where: { ...name ? { name } : {} },
        raw: true
      })
      const userAccount = await User.findOne({
        where: { ...account ? { account } : {} },
        raw: true
      })
      if (userEmail && userEmail.id !== user.id) {
        errors.push({ message: 'email 已重複註冊！' })
      }
      if (userAccount && userAccount.id !== user.id) {
        errors.push({ message: 'account 已重複註冊！' })
      }
      if (userName && userName.id !== user.id) {
        errors.push({ message: 'name 已重複註冊！' })
      }      
      const hash = password ? await bcrypt.hash(password, 10) : ''
      const editedUser = await user.update({
        account,
        name,
        email,
        password: hash
      })
      return res.render('setting')
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = userController
