const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: async (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/admin/tweets')
  },
  adminGetTweets: async (req, res, next) => {
    return res.render('admin/tweets')
  }
}

module.exports = adminController
