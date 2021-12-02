const db = require('../models')
const User = db.User

const adminController = {

  // admin signin page
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
}

module.exports = adminController