const adminController = {
  getTwitters: (req, res) => {
    return res.render('admin/twitters')
  },
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  usersPage: (req, res) => {
    res.render('admin/users')
  },
  tweetsPage: (req, res) => {
    res.render('admin/tweets')
  }
}

module.exports = adminController
