const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User // input the user schema

const adminController = {
  signin: (req, res) => {
    return res.render('admin/signin')
  }
}

module.exports = adminController
