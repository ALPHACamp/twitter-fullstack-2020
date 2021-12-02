const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (!account || !name || !email || !password || !checkPassword) {
        errors.push({ message: '所有欄位都是必填！' })
      }

      if (checkPassword !== password) {
        errors.push({ message: '兩次密碼輸入不同！' })
      }

      const user1Promise = User.findOne({ where: { account } })
      const user2Promise = User.findOne({ where: { email } })
      const [user1, user2] = await Promise.all([user1Promise, user2Promise])

      if (user1) {
        errors.push({ message: '帳號已重複註冊！' })
      }

      if (user2) {
        errors.push({ message: 'Email 已重複重複！' })
      }

      if (errors.length) {
        return res.render('signup', { errors, ...req.body })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      console.error(err)
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/')
  },

  signOut: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    return res.redirect('/signin')
  }
}

module.exports = userController
