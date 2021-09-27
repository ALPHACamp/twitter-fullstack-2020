const adminController = {
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  signinPage: (req, res) => {
    return res.render('admin/signin')
  },

  getUsers: (req, res) => {
    return res.render('admin/users')
  },

  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
}

module.exports = adminController
