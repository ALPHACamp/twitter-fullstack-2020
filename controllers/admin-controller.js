const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_message', '成功登入後台')
    res.redirect('/admin/tweets')
  },
  tweetsPage: (req, res) => {
    res.render('admin/tweets')
  },
  usersPage: (req, res) => {
    res.render('admin/users')
  }
}

module.exports = adminController
