const adminController = {
  SignInPage: (req, res) => {
    return res.render('admin/signin')
  },

  SignIn: (req, res) => {
    req.flash('success_messages', 'admin 成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', 'admin 登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  GetTweets: (req, res, next) => {
    res.render('admin/tweets')
  }
}

module.exports = adminController
