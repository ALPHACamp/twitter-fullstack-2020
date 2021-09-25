const db = require('../models')
const User = db.User
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;


module.exports = (app) => {
  // 初始化 Passport 模組
  app.use(passport.initialize());
  app.use(passport.session());
  // 設定本地登入策略
  passport.use(
    new LocalStrategy(
      {
        usernameField: "account",
        passwordField: 'password',//Form傳進來的變數如果不是預設的name，就 設定別名
      },
      (username, password, done) => {
        //傳進來的變數
        User.findOne({ where: { account: username } })
          .then((user) => {
            if (!user) {
              console.log("account does not exist");
              return done(
                null,
                false,
                console.log("warning_msg", "帳號還沒有註冊喔，請先註冊。")
              );
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                return done(
                  null,
                  false,
                  console.log("warning_msg", "Email或密碼錯誤。")
                );
              } 
                return done(
                  null,
                  user,
                  console.log("success_msg", "已成功登入。")
                );
              
            });
          })
          .catch((err) => done(err, false));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      user = user.toJSON()
      return done(null, user)
    })
    .catch((err) => done(err, null));
  });
};
