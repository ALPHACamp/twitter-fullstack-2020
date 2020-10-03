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
  getUserSettingPage: (req, res) => {
    if (req.user.id !== Number(req.params.id)) return res.redirect('back');
    return res.render('userSetting');
  },
  putUserSetting: (req, res) => {
    Object.keys(req.body).forEach((d) => (req.body[d] = req.body[d].trim()));
    const { account, name, email, password, checkPassword } = req.body;
    if (req.user.id !== Number(req.params.id)) return res.redirect('back');
    if (!account || !name || !email || !password || !checkPassword) {
      req.flash('errorMessage', '欄位不能為空~');
      return res.redirect(`/users/${req.user.id}/setting`);
    }
    if (password !== checkPassword) {
      req.flash('errorMessage', '密碼並不相符~');
      return res.redirect(`/users/${req.user.id}/setting`);
    }
    User.findOne({
      where: {
        [Op.or]: [{ account }, { email }],
        id: { [Op.ne]: req.user.id },
      },
    })
      .then((checkUser) => {
        if (checkUser) {
          req.flash('errorMessage', '帳號/信箱已使用~');
          return res.redirect(`/users/${req.user.id}/setting`);
        }
        User.findByPk(req.params.id)
          .then((user) => {
            user
              .update({
                account,
                name,
                email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
              })
              .then(() => {
                req.flash('successMessage', '資料已成功更改~');
                res.redirect(`/users/${req.user.id}/setting`);
              })
              .catch(() => {
                req.flash('errorMessage', '系統異常，請重新操作 #U103~');
                return res.redirect(`/users/${req.user.id}/setting`);
              });
          })
          .catch(() => {
            req.flash('errorMessage', '系統異常，請重新操作 #U104~');
            return res.redirect(`/users/${req.user.id}/setting`);
          });
      })
      .catch(() => {
        req.flash('errorMessage', '系統異常，請重新操作 #U105~');
        return res.redirect(`/users/${req.user.id}/setting`);
      });
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
        // Like,
        { model: Tweet, include: [Reply, Like] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    }).then((user) => {
      // const targetUser = user.toJSON();
      const followings = req.user.Followings.map((u) => u.id);
      const followers = req.user.Followers.map((u) => u.id);
      console.log(user.toJSON().Tweets[0].Likes);
      return res.render('user', {
        user: user.toJSON(),
        self: req.user,
        isFollowing: followings.includes(Number(req.params.id)),
      });
    });
  },
  signup: (req, res) => {
    Object.keys(req.body).forEach((d) => (req.body[d] = req.body[d].trim()));
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
