const adminController = {
  getSignin: (req, res) => {
    res.render('admin/login')
  },
  adminSignin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  getTweets: (req, res) => {
    res.render('admin/tweets')
  }
}

module.exports = adminController
