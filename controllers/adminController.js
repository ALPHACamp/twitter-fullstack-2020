const adminController = {
  loginPage: (req, res) => {
    return res.render('admin/login')
  },

  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/admin/login')
  }
}

module.exports = adminController