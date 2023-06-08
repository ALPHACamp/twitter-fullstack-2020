const { User } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: async (req, res) => {
    req.flash('success_msg', '登入成功')
    return res.redirect('/admin/tweets')
  }
}

module.exports = adminController