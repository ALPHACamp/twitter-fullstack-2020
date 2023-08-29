const { User } = require('../models')
const bcrypt = require('bcryptjs')

const loginController = {
  signUpPage: (req, res) => {
    res.render('logins/signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼不相符!')
    if (name.length > 50) throw new Error('暱稱長度不可超過50個字!')
    if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) throw new Error('所有欄位皆要填寫!')

    return Promise.all([User.findOne({ where: { email } }), User.findOne({ where: { account } })])
      .then(([sameEmailUser, sameAccountUser]) => {
        if (sameEmailUser) throw new Error('該Email已被使用!')
        if (sameAccountUser) throw new Error('該帳號名稱已被使用!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('logins/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = loginController
