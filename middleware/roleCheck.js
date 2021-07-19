const User = require('../models').User

module.exports = {
  isAdmin: async (req, res, next) => {
    const { account } = req.body
    let user = await User.findOne({ where: { 'email': account } })
    if (user) {
      if (user.role === 'admin') {
        return next()
      } else {
        req.flash('success_messages', '為您導向前台登入頁面')
        return res.redirect('/signin')
      }
    }
    req.flash('error_messages', '無此使用者')
    return res.redirect('/admin/signin')
  },
  isUser: async (req, res, next) => {
    const { account } = req.body
    let user = await User.findOne({ where: { 'email': account } })
    if (user) {
      if (user.role === null) {
        return next()
      } else {
        req.flash('success_messages', '為您導向前台登入頁面')
        return res.redirect('/signin')
      }
    }
    req.flash('error_messages', '無此使用者')
    return res.redirect('/signin')
  }
}