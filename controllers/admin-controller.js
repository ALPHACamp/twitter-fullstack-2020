const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  getTweets: (req, res) => {
    res.render('admin/tweets')
  }
}

module.exports = adminController