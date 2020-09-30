const adminService = require('../services/adminService')

const adminController = {

  getSigninPage: (req, res) => {
    return res.render('admin/signin')
  },

  getTweets: (req, res) => {
    adminService.getTweets(req, res, (data) => {
      return res.render('admin/tweets', data)
    })
  },

  signin: (req, res) => {
    return res.redirect('/admin/tweets')
  },
}

module.exports = adminController