const bcrypt = require('bcryptjs');
const db = require('../models');

const { User } = db;

const sessionsController = {
  registerPage: (req, res) => res.render('regist'),
  register    : (req, res) => {
    User.create({
      email   : req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
      name    : req.body.name,
    }).then((user) => res.redirect('/'));
  },
  loginPage: (req, res) => res.render('login'),

  login: (req, res) => {
    res.redirect('/');
  },

  logout: (req, res) => {
    req.logout();
    res.redirect('/login');
  },
};
module.exports = sessionsController;
