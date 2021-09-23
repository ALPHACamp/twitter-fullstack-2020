const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.User
const helpers = require('../_helpers')

const loginController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    const error_messages = []
    //加入多種錯誤訊息
    if (password !== checkPassword) {
      error_messages.push({ message: '密碼與確認密碼不相符！' })
    }

    if (error_messages.length) {
      return res.render('signup', {
        error_messages,
        account,
        name,
        email,
        password,
        checkPassword
      })
    }

    const user = await User.findOne({ where: { email } })
    if (user) {
      error_messages.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('signup', {
        error_messages,
        account,
        name,
        email,
        password,
        checkPassword
      })
    }

    await User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10),
        null
      ),
      avatar:
        'https://icon-library.com/images/default-user-icon/default-user-icon-17.jpg'
    })

    req.flash('success_messages', '成功註冊帳號！')
    res.redirect('/signin')
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '帳號或密碼錯誤')
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    }
  },

  logOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = loginController
