const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')

const userController = {
  // 註冊
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password) {
      req.flash('danger_msg', '欄位未正確填寫')
      return res.render('signup', { account, name, email, password, checkPassword })
    }
    if (password !== checkPassword) {
      // req.flash('danger_msg', '輸入密碼不一致')
      req.flash('danger_msg', '前後輸入密碼不一致')
      return res.render('signup', { account, name, email, password, checkPassword })
    }

    try {
      const usedAccount = await User.findOne({ where: { account } })
      if (usedAccount) throw new Error('該帳號已被使用')
      const usedEmail = await User.findOne({ where: { email } })
      if (usedEmail) throw new Error('該email已被使用')

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })
      req.flash('success_msg', '註冊成功，請以新帳號登入')
      res.redirect('/signin')
    } catch (e) {
      next(e)
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
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.uid
      let user = await User.findByPk(userId, {
        include: [Tweet]
      })
      user = user.toJSON()
      // console.log(user)
      res.render('user/user-tweets', { user })
    } catch (err) { next(err) }
  }
}

module.exports = userController