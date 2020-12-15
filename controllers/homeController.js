const db = require('../models')
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
  }
}