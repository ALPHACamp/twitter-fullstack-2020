const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;
const { Op } = require('sequelize');
const helpers = require('../_helpers');

const userController = {
  getSigninPage: (req, res) => {
    return res.render('signin');
  },

  getSignupPage: (req, res) => {
    return res.render('signup');
  },
  getUserSettingPage: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id))
      return res.redirect('back');
    return res.render('userSetting');
  },
  putUserSetting: (req, res) => {
    Object.keys(req.body).forEach((d) => (req.body[d] = req.body[d].trim()));
    const { account, name, email, password, checkPassword } = req.body;
    if (helpers.getUser(req).id !== Number(req.params.id))
      return res.redirect('back');
    if (!account || !name || !email || !password || !checkPassword) {
      req.flash('errorMessage', '欄位不能為空~');
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`);
    }
    if (password !== checkPassword) {
      req.flash('errorMessage', '密碼並不相符~');
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`);
    }
    User.findOne({
      where: {
        [Op.or]: [{ account }, { email }],
        id: { [Op.ne]: helpers.getUser(req).id },
      },
    })
      .then((checkUser) => {
        if (checkUser) {
          req.flash('errorMessage', '帳號/信箱已使用~');
          return res.redirect(`/users/${helpers.getUser(req).id}/setting`);
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
                res.redirect(`/users/${helpers.getUser(req).id}/setting`);
              })
              .catch(() => {
                req.flash('errorMessage', '系統異常，請重新操作 #U103~');
                return res.redirect(
                  `/users/${helpers.getUser(req).id}/setting`,
                );
              });
          })
          .catch(() => {
            req.flash('errorMessage', '系統異常，請重新操作 #U104~');
            return res.redirect(`/users/${helpers.getUser(req).id}/setting`);
          });
      })
      .catch(() => {
        req.flash('errorMessage', '系統異常，請重新操作 #U105~');
        return res.redirect(`/users/${helpers.getUser(req).id}/setting`);
      });
  },
  signin: (req, res) => {
    return res.redirect('/tweets');
  },
  getSelf: (req, res) => {
    let selfId = helpers.getUser(req).id;
    return res.redirect(`/users/${selfId}`);
  },
  getUser: (req, res) => {
    let userId = req.params.id;
    return User.findByPk(userId, {
      include: [
        {
          model: Tweet,
          include: [Reply, Like],
          order: [['updatedAt', 'DESC']],
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    }).then((user) => {
      if (user !== null && user.isAdmin === false) {
        // const targetUser = user.toJSON();
        const followings = helpers.getUser(req).Followings.map((u) => u.id);
        const followers = helpers.getUser(req).Followers.map((u) => u.id);

        const data = user.toJSON();
        let Tweets = data.Tweets;
        Tweets = Tweets.map((t) => {
          if (t.Likes.length > 0) {
            let likeIds = t.Likes.map((l) => l.UserId);
            t.isLikeBySelf = likeIds.includes(helpers.getUser(req).id);
          } else {
            t.isLikeBySelf = false;
          }
          return t;
        });
        return res.render('user', {
          user: data,
          self: helpers.getUser(req),
          isFollowing: followings.includes(Number(req.params.id)),
        });
      } else {
        req.flash('errorMessage', '使用者不存在');
        res.redirect(`/users/${helpers.getUser(req).id}`);
      }
    });
  },
  getFollowersPage: (req, res) => {
    return res.render('follower');
  },
  getFollowingsPage: (req, res) => {
    return res.render('following');
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
