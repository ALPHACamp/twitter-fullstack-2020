const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  //註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  
}

module.exports = userController