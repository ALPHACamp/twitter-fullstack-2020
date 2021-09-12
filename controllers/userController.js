const bcrypt = require('bcrypt-nodejs')
const bodyParser = require('body-parser')
const { NONE } = require('sequelize')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup', { layout: 'other' })
  },

  signUp: (req, res) => {
    const { name, email, password } = req.body
    User.Creat({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    }).then(user => {
      return res.redirect('/signin')
    })
  }
}

module.exports = userController