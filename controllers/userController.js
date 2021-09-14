const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

let userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },

  register: (req, res) => {
    User.create({
      account: req.body.account,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }).then((user) => {
      return res.redirect('/login')
    })
  }
}

module.exports = userController
