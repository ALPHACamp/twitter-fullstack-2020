const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.User
const helpers = require('../_helpers')

const loginController = {
  signUpPage: async (req, res) => {
    try {
      return res.render('signup', { status: (200) })
    } catch (err) {
      res.status(302);
      console.log('signUpPage err')
      req.flash('error_messages', '讀取註冊頁面失敗')
      return res.redirect('back')
    }
  },

  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      let errorMessages = []

      //加入多種錯誤訊息
      if (!name || !email || !password || !checkPassword || !account) {
        errorMessages.push({ message: '所有欄位都是必填。' })
      }

      if (password !== checkPassword) {
        errorMessages.push({ message: '密碼與確認密碼不相符！' })
      }

      const userEmail = await User.findOne({ where: { email } })
      const userAccount = await User.findOne({ where: { account } })
      if (userEmail) {
        errorMessages.push({ message: '這個 Email 已經註冊過了。' })
      }
      if (userAccount) {
        errorMessages.push({ message: '這個 Account 已經註冊過了。' })
      }
      if (errorMessages.length) {
        return res.render('signup', {
          errorMessages,
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
      res.status(200)
      res.redirect('/signin')
    } catch (err) {
      res.status(302);
      console.log('signUp err')
      req.flash('error_messages', '註冊失敗')
      return res.redirect('back')
    }
  },

  signInPage: (req, res) => {
    try {
      return res.render('signin', { status: (200) })
    } catch (err) {
      res.status(302);
      console.log('signInPage err')
      req.flash('error_messages', '讀取登入頁面失敗')
      return res.redirect('back')
    }
  },

  signIn: (req, res) => {
    try{
      if (helpers.getUser(req).role === 'admin') {
      req.flash('error_messages', '帳號或密碼錯誤')
      res.redirect('/signin')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    }
    }catch(err){
      res.status(302);
      console.log('signIn err')
      req.flash('error_messages', '登入失敗')
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
      console.log('logOut err')
      req.flash('error_messages', '登出失敗！')
      res.status(302);
      return res.redirect('/')
    }
  }
}

module.exports = loginController
