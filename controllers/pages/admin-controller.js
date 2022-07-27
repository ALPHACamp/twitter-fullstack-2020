const { User } = require('../../models')

const adminConroller = {
  getSignin: (req, res) => {
    res.render('admin/signin')
  },
  postSignin: (req, res) => {
    const ADMIN = 'admin'
    if (req.user.role === ADMIN) {
      req.flash('success_messages', '成功登入後台')
      return res.redirect('/admin/tweets')
    }
    req.logout()
    req.flash('error_messages', '帳號不存在')
    return res.redirect('/admin/signin')
  }
}

module.exports = adminConroller
