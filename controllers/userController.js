const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res) => {
    const { name, email, password } = req.body
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    })
    return res.redirect('/signin')
  }
}

module.exports = userController
