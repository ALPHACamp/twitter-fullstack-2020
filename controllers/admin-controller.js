const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Admin成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res) => {
    res.render('admin/tweets')
  }
}

module.exports = adminController
