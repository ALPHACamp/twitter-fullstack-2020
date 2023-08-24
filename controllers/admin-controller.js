const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: async (req, res) => {
    return res.redirect('/admin/tweets')
  },
  getTweets: (req, res) => {
    return res.render('admin/tweets')
  }
}

module.exports = adminController
