const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  getTweet: (req, res) => {
    return res.render('admin/tweets')
  }
}


module.exports = adminController