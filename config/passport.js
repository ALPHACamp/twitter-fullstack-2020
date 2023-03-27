const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
//const User = require('../models');
const { User, Like, Tweet, Reply } = require('../models');

passport.use(
  new LocalStrategy(
    { usernameField: 'account', passReqToCallback: true },
    (req, account, password, cb) => {
      User.findOne({ where: { account } }).then((user) => {
        // console.log('@@@@', user)
        req.flash('userInput', req.body);
        if (!user) {
          return cb(
            null,
            false,
            req.flash('errorMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        if (req.url === "/admin/signin" &&
          user.dataValues.isAdmin === false && !user.dataValues.role) {
          return cb(
            null,
            false,
            req.flash('errorMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        if (req.url === "/signin" &&
          (user.dataValues.isAdmin === true || user.dataValues.role === 'admin')) {
          return cb(
            null,
            false,
            req.flash('errorMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(
            null,
            false,
            req.flash('errorMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        return cb(null, user);
      });
    },
  ),
);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
