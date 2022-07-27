"use strict";

var passport = require('passport');

var LocalStrategy = require('passport-local');

var bcrypt = require('bcryptjs');

var _require = require('../models'),
    User = _require.User,
    Tweet = _require.Tweet,
    Like = _require.Like;

passport.use(new LocalStrategy({
  usernameField: 'account',
  passReqToCallback: true
}, function (req, account, password, cb) {
  User.findOne({
    where: {
      account: account
    }
  }).then(function (user) {
    if (!user) return cb(null, false, req.flash('error_messages_account', '帳號不存在'));
    bcrypt.compare(password, user.password).then(function (res) {
      if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'));
      return cb(null, user);
    });
  })["catch"](function (err) {
    return cb(err);
  });
}));
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
  User.findByPk(id, {
    include: [{
      model: Tweet,
      include: Like
    }, {
      model: User,
      as: 'Followers'
    }, {
      model: User,
      as: 'Followings'
    }]
  }).then(function (user) {
    return cb(null, user.toJSON());
  })["catch"](function (err) {
    return cb(err);
  });
});
module.exports = passport;