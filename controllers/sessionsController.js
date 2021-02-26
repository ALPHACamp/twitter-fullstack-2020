const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;

const sessionsController = {
  registerPage: (req, res) => {
    return res.render('regist')
  },
  register: (req, res) => {
    User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
      name: req.body.name
    }).then(user => {
      return res.redirect('/')
    })
  },
  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    res.redirect('/')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/signin')
  }
};
module.exports = sessionsController;