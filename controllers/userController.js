const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')

const userController = {
  signupPage: (req, res) => {
    return res.render('signup')
  },

  signup: (req, res) => {
    const { name, email, password, passwordConfirm } = req.body
    const messages = []

    if (password !== passwordConfirm) {
      messages.push('密碼輸入不一致')
      return res.render('signup', { name, email, password, passwordConfirm, messages })

      // 使用 req.flash() 需搭配 res.redirect()，如此就不能回傳使用者填入表單的資訊到頁面上了
      // req.flash('error_messages', '密碼輸入不一致')
      // return res.redirect('/signup', { name, email, password, passwordConfirm })
    }

    User.findOne({ where: { email: email } })
      .then(user => {
        if (user) {
          messages.push('此 Email 已註冊過')
          return res.render('signup', { name, email, password, passwordConfirm, messages })
          // req.flash('error_messages', '此 Email 已註冊過')
          // return res.render('signup', { name, email, password, passwordConfirm })
        }

        User.create({
          email: email,
          name: name,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10).null),
          role: 'user'
        })
          .then(user => {
            messages.push('註冊成功')
            return res.render('signin', { messages })

            // req.flash('success_messages', '註冊成功')
            // return res.redirect('/signin')
          })
      })
  },

  signinPage: (req, res) => {
    return res.render('signin')
  },

  signin: (req, res) => {
    return res.redirect('/')
  },

  adminSigninPage: (req, res) => {
    return res.render('admin/signin')
  },

  adminSignin: (req, res) => {
    return res.redirect('/admin/tweets')
  }

}

module.exports = userController