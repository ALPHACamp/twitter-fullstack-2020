


module.exports = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  getTweets: (req, res) => {
    return res.render('admin/tweet')
  }
}