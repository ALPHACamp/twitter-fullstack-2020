const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.User

const loginController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    let errorMessages = []
    //加入多種錯誤訊息
    if (!name || !email || !password || !checkPassword || !account) {
      errorMessages.push({ message: '所有欄位都是必填。' })
    }

    if (password !== checkPassword) {
      errorMessages.push({ message: '密碼與確認密碼不相符！' })
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
    res.redirect('/signin')
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    if (req.user.role === 'admin') {
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
