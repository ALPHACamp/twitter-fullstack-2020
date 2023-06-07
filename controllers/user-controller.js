const bcrypt = require('bcrypt-nodejs')
const { User } = require('../models')

const userController = {
  // 註冊
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password) throw new Error('欄位未正確填寫')
    if (password !== checkPassword) throw new Error('輸入密碼不一致')
    try {
      const usedAccount = await User.findByPk({ where: { account } })
      if (usedAccount) throw new Error('該帳號已被使用')
      const usedEmail = await User.findByPk({ where: { email } })
      if (usedEmail) throw new Error('該email已被使用')

      const hashedPassword = await bcrypt.hash(password, 10)
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })
      req.flash('success_msg', '註冊成功，請以新帳號登入')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  // 登入
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '登入成功')
    return res.redirect('/tweets')
  },
  // 登出
  signOut: (req, res) => {
    req.logout()
    req.flash('success_msg', "登出成功")
    return res.redirect('/signin')
  }
}

module.exports = userController