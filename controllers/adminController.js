const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');

let adminController = {
  adminLoginPage: (req, res) => {
    return res.render('admin/login');
  },
  login: (req, res) => {
    req.flash('success_messages', 'Login successfully');
    res.redirect('/admin/tweets');
  }
};

module.exports = adminController;
