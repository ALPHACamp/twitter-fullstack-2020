const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;
const { Op } = require('sequelize');

const userController = {
  getSigninPage: (req, res) => {
    return res.render('signin');
  },

  getSignupPage: (req, res) => {
    return res.render('signup');
  },

  signin: (req, res) => {
    return res.redirect('/tweets');
  },
  getSelf: (req, res) => {
    let selfId = req.user.id;
    return res.redirect(`/users/${selfId}`);
  },
  getUser: (req, res) => {
    let userId = req.params.id;
    return User.findByPk(userId, {
      include: [
        Like,
        { model: Tweet, include: Reply },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    }).then((user) => {
      // const targetUser = user.toJSON();
      const followings = req.user.Followings.map((u) => u.id);
      const followers = req.user.Followers.map((u) => u.id);
      return res.render('user', {
        user: user.toJSON(),
        self: req.user,
        isFollowing: followings.includes(Number(req.params.id)),
      });
    });
  },
  signup: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body;
    req.flash('userInput', req.body);
    if (!account || !name || !email || !password || !checkPassword) {
      req.flash('errorMessage', '請確認是否有欄位未填寫');
      return res.redirect('/signup');
    }
    if (!(password === checkPassword)) {
      req.flash('errorMessage', '兩次密碼並不相同，請重新輸入');
      return res.redirect('/signup');
    }
    User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
      .then((user) => {
        if (user) {
          req.flash('errorMessage', '帳號/信箱已使用，請重新輸入');
          return res.redirect('/signup');
        }
        User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        })
          .then(() => {
            req.flash('successMessage', '成功註冊!! 請登入');
            return res.redirect('/signin');
          })
          .catch(() => {
            req.flash('errorMessage', '系統異常，請重新操作 #U101');
            return res.redirect('/signup');
          });
      })
      .catch(() => {
        req.flash('errorMessage', '系統異常，請重新操作 #U102');
        return res.redirect('/signup');
      });
  },
};

module.exports = userController;
