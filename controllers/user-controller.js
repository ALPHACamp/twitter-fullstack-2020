const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User } = require('../models')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位皆為必填')
      }

      const findUser = await User.findOne({
        where: { [Op.or]: [{ account }, { email }] }, // Op.or: 表示接下來陣列內的條件之一成立即可
        attributes: ['account', 'email'] // 若有找到，只返回 account 和 email 屬性即可
      })

      if (findUser && findUser.account === account) {
        errors.push('此帳號已被註冊')
      }
      if (name.length > 50) {
        errors.push('名稱不能超過 50 個字')
      }
      if (findUser && findUser.email === email) {
        errors.push('此 Email 已被註冊')
      }
      if (password !== checkPassword) {
        errors.push('兩次輸入的密碼不相同')
      }
      if (errors.length > 0) {
        throw new Error(errors.join('\n & \n'))
      }

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({ account, name, email, password: hash })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  }
}
module.exports = userController
