const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  tweetsPage: (req, res) => {
    res.render('admin/tweets')
  },
  usersPage: (req, res) => {
    res.render('admin/users')
  }
}

module.exports = adminController
