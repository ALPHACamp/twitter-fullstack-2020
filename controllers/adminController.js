const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  adminSigninPage: (req, res) => {
    res.render('admin/adminSigninPage')
  },
  // 管理者進入passport前檢查關卡
  adminCheckRequired: (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      req.flash('error_messages', '請輸入帳號密碼！')
      return res.redirect('/admin/signin')
    }
    return next()
  },
  // 管理者成功登入後訊息提示
  adminSigninSuccess: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/admin/tweets')
  },
  adminSignOut: (req, res) => {
    // 登出
  },
  adminTweetsPage: (req, res) => {
    Tweet.findAll({ raw: true, nest: true })
      .then(tweets => res.json({ tweets }))
      .catch(err => console.log(err))
  },
  adminUsersPage: (req, res) => {
    User.findAll({ raw: true, nest: true })
      .then(users => res.json({ users }))
      .catch(err => console.log(err))
  }
}

module.exports = adminController
