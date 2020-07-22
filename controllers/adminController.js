const adminController = {
  signInPage: (req, res) => res.render('admin/signin'),
  signIn: (req, res) => {
    req.flash('successMessages', '登入成功')
    res.redirect('/admin/tweets')
  }
}

module.exports = adminController