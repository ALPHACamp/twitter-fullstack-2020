const bcrypt = require('bcrypt-nodejs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (name.length > 50) {
      req.flash('error_messages', '暱稱不得超過50字!')
      return res.render('signup', { account, name, email, password, checkPassword })
    }
    if (password !== checkPassword) {
      req.flash('error_messages', '密碼不相符!')
      return res.render('signup', { account, name, email, password, checkPassword })
    }

    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([filterAccount, filterEmail]) => {
        if (filterAccount) throw new Error('account 已重複註冊！')
        if (filterEmail) throw new Error('email 已重複註冊！')

        return bcrypt.hash(password, 10)
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
      .catch(err => {
        next(err)
      })
  }
}

module.exports = userController
