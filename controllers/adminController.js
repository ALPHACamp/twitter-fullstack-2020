const adminController = {
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  loginPage: (req, res) => {
    return res.render('admin/login')
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/login')
  }
}

module.exports = adminController
