const adminController = {
  adminSigninPage: (req, res) => {
    res.render('admin/signin')
  },
  adminTweetsPage: (req, res) => {
    res.render('admin/tweets')
  },
  adminSignin: (req, res, next) => {
    console.log(req.user)
    req.flash('success_messages', '成功登入!')
    res.redirect('admin/tweets')
  }
}

module.exports = adminController
