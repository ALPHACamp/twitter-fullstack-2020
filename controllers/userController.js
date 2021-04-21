const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers');
const User = db.User

const userController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (!account || !name || !email || !password || !passwordCheck) {
      return res.redirect('back')
    }
    if (password !== passwordCheck) {
      return res.redirect('back')
    }
    User.create({
      account: account,
      name: name,
      email: email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }).then(user => {
      return res.redirect('/signin')
    })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  }

}

module.exports = userController