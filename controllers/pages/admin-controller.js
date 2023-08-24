const adminController = {
  getTweets: (req, res, next) => {
    res.render('admin/tweets')
  }
}

module.exports = adminController
