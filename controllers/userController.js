const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  }
}

module.exports = userController