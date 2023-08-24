const adminController = {
  signInPage: (req, res) => {
    res.render('admins/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '管理員成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '管理員登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  }
}

module.exports = adminController
