const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.User

const loginController = {
  signUpPage: async (req, res) => {
    try {
      return res.render('signup', { status: (200) })
    } catch (err) {
      console.log(err)
      res.status(302);
      console.log('signUpPage err')
      req.flash('error_messages', '讀取註冊頁面失敗')
      return res.redirect('back')
    }
  },

  signUp: async (req, res) => {
    try {
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
      res.status(200);
      res.redirect('/signin')
    } catch (err) {
      console.log(err)
      res.status(500);
      console.log('getReplies err')
      req.flash('error_messages','註冊失敗')
      return res.redirect('back')
    }
  },

  signInPage: (req, res) => {
    try {
      return res.render('signin', { status: (200) })
    } catch (err) {
      console.log(err)
      console.log('signInPage err')
      req.flash('error_messages', '讀取登入頁面失敗')
      res.status(302);
      return res.redirect('back')
    }
  },

  signIn: (req, res) => {
    try {
      if (req.user.role === 'admin') {
        req.flash('error_messages', '帳號或密碼錯誤')
        res.status(302);
        res.redirect('/signin')
      } else {
        req.flash('success_messages', '成功登入！')
        res.status(200);
        res.redirect('/tweets')
      }
    } catch (err) {
      console.log(err)
      console.log('signIn err')
      req.flash('error_messages', '登入失敗')
      res.status(302);
      return res.redirect('back')
    }
  },

  logOut: (req, res) => {
    try {
      req.flash('success_messages', '登出成功！')
      req.logout()
      res.status(200);
      res.redirect('/signin')
    } catch (err) {
      console.log(err)
      console.log('logOut err')
      req.flash('error_messages', '登出失敗！')
      res.status(302);
      return res.redirect('/')
    }
  }
}

module.exports = loginController
