const adminController = {
  adminSigninPage: (req, res) => {
    res.render('admin/signin')
  },
  adminTweetsPage: (req, res) => {
    res.render('admin/tweets')
  },
  adminUsersPage: (req, res) => {
    res.render('admin/users')
  },
  adminSignin: (req, res, next) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('admin/tweets')
  }
}

module.exports = adminController
