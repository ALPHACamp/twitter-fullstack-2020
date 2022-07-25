// admin頁面各種 signin/ getuser/ gettweet/ deletetweet/ logout
const { User } = require('../models')
const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getAdminTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  getAdminUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => {
        console.log(users)
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
