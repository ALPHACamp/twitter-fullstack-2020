const { User } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin-signin')
  },
  signIn: async (req, res, next) => {

  }
}

module.exports = adminController