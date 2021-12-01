const bcrypt = require("bcrypt-nodejs")
const db = require("../models")
const User = db.User

const userController = {
  signInPage: (req, res) => {
    return res.render("signin")
  },

  signUpPage: (req, res) => {
    return res.render("signup")
  },

  signUp: (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
    }).then((user) => {
      return res.redirect("/signin")
    })
  },
}
module.exports = userController
