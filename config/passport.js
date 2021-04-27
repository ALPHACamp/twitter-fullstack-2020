const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;

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
            req.flash('errorScrollingMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        if (req.url === "/admin/signin" && 
          user.dataValues.isAdmin === false && !user.dataValues.role) {
          return cb(
            null,
            false,
            req.flash('errorScrollingMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        if (req.url === "/signin" && 
          (user.dataValues.isAdmin === true || user.dataValues.role === 'admin')) {
          return cb(
            null,
            false,
            req.flash('errorScrollingMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(
            null,
            false,
            req.flash('errorScrollingMessage', '帳號/密碼輸入錯誤！'),
          );
        }
        return cb(null, user);
      });
    },
  ),
);

const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'test';

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id).then((user) => {
    if (!user) return next(null, false);
    return next(null, user);
  });
});
passport.use(strategy);

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
    return cb(null, user.toJSON());
  });
});

module.exports = passport;
