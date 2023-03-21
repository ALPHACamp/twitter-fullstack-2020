const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  getTweets: (req, res) => {
    res.render('admin/tweets')
  },
  getUsers: (req, res) => {
    res.render('admin/users')
  }
}

module.exports = adminController