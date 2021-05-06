const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Tweet = db.Tweet;
const Like = db.Like;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({
          where: { email: username },
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' },
          ],
        });
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
  User.findByPk(id, {
    include: [
      Tweet,
      Like,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
    ],
  }).then(async (user) => {
    user = user.toJSON();
    const topUser = await User.findAll({
      include: [{ model: User, as: 'Followers' }],
      limit: 10,
      where: { role: 'user' },
    }).then((users) => {
      // 整理 users 資料
      users = users.map((user1) => ({
        ...user1.dataValues,
        // 計算追蹤者人數
        FollowerCount: user1.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件

        isFollowed: user.Followings.map((d) => d.id).includes(user1.id),
      }));
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      return users;
    });
    user.topUser = topUser;
    return done(null, user);
  });
});

module.exports = passport;
