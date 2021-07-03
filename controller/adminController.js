const adminController = {
  getAdminTweets: (req, res) => {
    res.render('admin/tweets')
  }
}
module.exports = adminController