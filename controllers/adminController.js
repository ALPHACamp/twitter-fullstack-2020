let adminController = {
  loginPage: (req, res) => {
    return res.render('admin/login')
  },

  getTweets: (req, res) => {
    return res.render('admin/tweets')
  },

  getUser: (req, res) => {
    return res.render('admin/users')
  },


}

module.exports = adminController