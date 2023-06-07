const adminController = {
  getTweets: (req, res, next) => {
    res.render('admin/admin-tweets')
  },

  getUsers: (req, res, next) => {
    res.render('admin/admin-users')
  }
}

module.exports = adminController
