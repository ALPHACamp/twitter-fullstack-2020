const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    try {
      const { name, email, password, passwordCheck } = req.body

      if (passwordCheck !== password) {
        req.flash('error_messages', '兩次密碼輸入不同！')
        return res.redirect('/signup')
      }

      const user = await User.findOne({ where: { email } })
      if (user) {
        req.flash('error_messages', '電子信箱重複！')
        return res.redirect('/signup')
      }

      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
