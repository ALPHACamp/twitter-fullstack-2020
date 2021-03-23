const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');

const {
  User, Tweet, Notification,
} = db;

passport.use(new LocalStrategy(
  {
    usernameField    : 'account',
    passwordField    : 'password',
    passReqToCallback: true,
  },
  (req, username, password, cb) => {
    User.findOne({ where: { account: username } }).then((user) => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'));
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'));
      return cb(null, user);
    });
  },
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Subscribers' },
      { model: User, as: 'Subscribings' },
      { model: Notification, as: 'Notifications' },
    ],
  })
  .then((user) => {
    // Assign user analytics
    Object.assign(user.dataValues, {
      followingCount: user.dataValues.Followings.length,
      followerCount : user.dataValues.Followers.length,
    });

    return cb(null, user.toJSON());
  });
});

module.exports = passport;
