const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.User

const loginController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    const role = false
    const error_messages = []
    //加入多種錯誤訊息
    if (password !== passwordCheck) {
      error_messages.push({ message: '密碼與確認密碼不相符！' })
    }

    if (error_messages.length) {
      return res.render('signup', {
        error_messages,
        account,
        name,
        email,
        password,
        passwordCheck
      })
    }

    User.findOne({ where: { email } }).then(user => {
      if (user) {
        error_messages.push({ message: '這個 Email 已經註冊過了。' })
        return res.render('signup', {
          error_messages,
          account,
          name,
          email,
          password,
          passwordCheck
        })
      }
      return User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10), null),
        role,
        avatar:
          'https://icon-library.com/images/default-user-icon/default-user-icon-17.jpg'
      }).then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
    })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    if (req.user.role) {
      req.flash('error_messages', '帳號或密碼錯誤')

      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')

      res.redirect('/')
    }
  },

  logOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = loginController
