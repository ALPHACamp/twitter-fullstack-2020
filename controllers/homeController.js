const { Op } = require("sequelize")
const bcrypt = require('bcryptjs')
const db = require('../models')
const { name } = require("faker")
const User = db.User

module.exports = {
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signUpPage: (req, res) => {
    return res.render('signup')
  },
  
  signIn: (req, res) => {
    res.redirect('/tweets')
  },
  
  signup: (req, res) => {
    const { account, name, email, password, confirmPassword } = req.body
    const errors = []

    if (!account || !name || !email || !password || !confirmPassword) {
      errors.push({ message: 'All fields are required.' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: "Password doesn't match the confirm password." })
    }
    if (errors.length) {
      return res.render('signup', {
        account,
        name,
        email,
        password,
        confirmPassword,
        errors
      })
    }

    User.findOne({ where: { [Op.or]: [{ account: account }, { email: email }] } })
      .then(user => {
        if (user) {
          errors.push({ message: "Account or Email already exists." })
          return res.render('signup', {
            account,
            name,
            email,
            password,
            confirmPassword,
            errors
          })
        }

        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => User.create({
            account,
            name,
            email,
            password: hash
          }))
          .then(user => res.redirect('/signin'))
          .catch(err => console.log(err))
      })
  }
}