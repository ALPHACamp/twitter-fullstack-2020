const adminController = {
  signinPage: (req, res) => {
    res.render('admin/signin')
  },
  signin: (req, res) => {
    res.redirect('/admin/tweets')
  }
}

module.exports = adminController