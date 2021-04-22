const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const db = require('../models');
const User = db.User;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ account: username });
        if (!user)
          return done(null, false, req.flash('error_msg', '帳號尚未註冊'));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, req.flash('error_msg', '密碼錯誤！'));

        return done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findByPk(id).then((user) => {
    user = user.toJSON();
    return done(null, user);
  });
});

module.exports = passport;
