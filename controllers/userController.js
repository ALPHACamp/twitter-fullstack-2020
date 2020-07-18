const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');

let userController = {
  loginPage: (req, res) => {
    return res.render('login');
  },
  signupPage: (req, res) => {
    return res.render('signup');
  },
  signup: (req, res) => {
    //password and confirmPassword must be the same
    if (req.body.password !== req.body.confirmPassword) {
      req.flash('error_messages', 'Please check your confirm password');
      return res.redirect('/signup');
    }
    //check if this email has been registered
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        return req.flash('error_messages', 'This email has been registered');
      }
      User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10, null)
        ),
        avatar:
          'https://loremflickr.com/cache/resized/65535_49534054127_ef7d5544b9_320_240_nofilter.jpg',
        role: 'user'
      })
        .then((user) => {
          req.flash('success_messages', 'Signuped successfully');
          return res.redirect('/login');
        })
        .catch((err) => console.log(err));
    });
  }
};

module.exports = userController;
