const user = require("../models/user")
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },

  register: (req, res) => {
    User.create({
      email: req.body.email,
      name: req.body.name,
      account: req.body.account,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }).then(() => {
      return res.redirect('/login')
    })
  },

  loginPage: (req, res) => {
    return res.render('login')
  }
}

module.exports = userController