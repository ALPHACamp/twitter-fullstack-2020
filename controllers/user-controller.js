const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (name.length > 50) {
        errors.push('名稱不得超過 50 個字')
      }

      if (password !== checkPassword) {
        errors.push('密碼與密碼確認不相符')
      }

      const usedAccount = await User.findOne({ where: { account } })
      if (usedAccount) {
        errors.push('此帳號已被註冊')
      }

      const usedEmail = await User.findOne({ where: { email } })
      if (usedEmail) {
        errors.push('此 Email 已被註冊')
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n & \n'))
      }

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({ account, name, email, password: hash })

      req.flash('success_messages', '註冊成功！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [Tweet],
        order: [['createdAt', 'DESC']]
      })

      if (!user) { throw new Error("User didn't exist!") }

      res.render('users/self', { user: user.toJSON()/*, myUser: req.user.id */ })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
