const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;
const Private = db.Private;

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
        if (req.url === "/admin/signin" && user.dataValues.role !== 'admin') {
          return cb(
            null,
            false,
            req.flash('errorMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        if (req.url === "/signin" && user.dataValues.role === 'admin') {
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


passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      Like,
      { model: Tweet, include: Reply },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
    ],
  }).then((user) => {
    if (!user) return
    Private.findAll({
      where: {
        ReceiveId: user.dataValues.id,
        isLooked: false,
      }
    })
      .then(data => {
        user.dataValues.noSeeMsg = data.length
        return cb(null, user.toJSON());
      })
  });
});


module.exports = passport;
