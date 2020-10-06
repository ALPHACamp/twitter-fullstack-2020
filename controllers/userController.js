const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;
const { Op } = require('sequelize');
const helpers = require('../_helpers');

const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

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
      req.flash('errorScrollingMessage', '欄位不能為空~');
      return res.redirect(`/users/${helpers.getUser(req).id}/setting`);
    }
    if (password !== checkPassword) {
      req.flash('errorScrollingMessage', '密碼並不相符~');
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
          req.flash('errorScrollingMessage', '帳號/信箱已使用~');
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
                req.flash('successScrollingMessage', '資料已成功更改~');
                res.redirect(`/users/${helpers.getUser(req).id}/setting`);
              })
              .catch(() => {
                req.flash('errorScrollingMessage', '系統異常，請重新操作 #U103~');
                return res.redirect(
                  `/users/${helpers.getUser(req).id}/setting`,
                );
              });
          })
          .catch(() => {
            req.flash('errorScrollingMessage', '系統異常，請重新操作 #U104~');
            return res.redirect(`/users/${helpers.getUser(req).id}/setting`);
          });
      })
      .catch(() => {
        req.flash('errorScrollingMessage', '系統異常，請重新操作 #U105~');
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
    return res.redirect(`/users/${userId}/tweets`);
  },
  getTweetsPage: (req, res) => {
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
        //const followers = helpers.getUser(req).Followers.map((u) => u.id);

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
          user: helpers.getUser(req),
          visitUser: data,
          isFollowing: followings.includes(Number(req.params.id)),
        });
      } else {
        req.flash('errorMessage', '使用者不存在');
        res.redirect(`/users/${helpers.getUser(req).id}`);
      }
    });
  },
  getLikesPage: (req, res) => {
    let UserId = req.params.id;
    return User.findByPk(UserId, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        {
          model: Tweet,
          as: 'LikeTweets',
          include: [User, Reply, { model: User, as: 'LikedByUsers' }],
        },
      ],
      order: [['LikeTweets', 'updatedAt', 'DESC']],
    }).then((visitUser) => {
      const followings = helpers.getUser(req).Followings.map((u) => u.id);
      const likes = helpers.getUser(req).Likes
        ? helpers
          .getUser(req)
          .Likes.filter((u) => u.Position === 'tweet')
          .map((t) => t.PositionId)
        : [];

      //console.log(likes);
      visitUser.dataValues.LikeTweets.forEach((lt) => {
        //console.log('before @@@', lt.dataValues.LikedByUsers);
        lt.dataValues.isLikeBySelf = likes.includes(lt.id);
        //console.log('before @@@', lt);
      });
      let isFollowing = followings.includes(UserId);

      return res.render('user-like', {
        user: helpers.getUser(req),
        isFollowing,
        visitUser,
      });
    });

    //Like.findAll({where:{UserId,Position:'tweet'}},attribute:[])
    // return User.findByPk(userId, {
    //   include: [
    //     Tweet,
    //     {
    //       model: Tweet,
    //       as:'LikedTweets',
    //       include: [User, Reply],
    //       order: [['updatedAt', 'DESC']],
    //     },
    //     { model: User, as: 'Followers' },
    //     { model: User, as: 'Followings' },
    //   ],
    // });
  },
  getFollowersPage: (req, res) => {
    let userId = req.params.id
    User.findByPk(userId, {
      include: [
        Tweet,
        { model: User, as: 'Followers' }
      ]
    })
      .then((user) => {
        const users = user.toJSON()
        const isFollowed = users.Followers.map((d) => d.id).includes(helpers.getUser(req).id)
        console.log(users)
        return res.render('follower', {
          users,
          isFollowed
        });
      })
  },
  getFollowingsPage: (req, res) => {
    return res.render('following');
  },
  putUserProfile: async (req, res) => {
    const UserId = Number(req.params.id);
    //imgur.setClientID(IMGUR_CLIENT_ID);
    console.log('IMGUR_CLIENT_ID', IMGUR_CLIENT_ID);
    //console.log('login', helpers.getUser(req).id);
    //console.log('pa $$$', UserId);
    if (helpers.getUser(req).id !== UserId) {
      req.flash('errorMessage', '你沒有足夠的權限');
      res.redirect('/tweets');
    }

    if (!req.body.name || req.body.name.length > 50) {
      req.flash('errorMessage', '名稱長度不符');
      return res.redirect('back');
    }

    if (!req.body.introduction || req.body.introduction.length > 160) {
      req.flash('errorMessage', '自我介紹長度不符');
      return res.redirect('back');
    }

    const { files } = req;
    //console.log('files', files);
    //console.log('file', req.file);
    if (files) {
      const { avatar, cover } = req.files;
      imgur.setClientID(IMGUR_CLIENT_ID);

      if (avatar != null) {
        let avatarPath = avatar[0].path;
        await imgur.upload(avatarPath, async (err, img) => {
          let avatar = img.data.link;
          console.log('avatar', avatar);
          if (cover != null) {
            let coverPath = cover[0].path;
            await imgur.upload(coverPath, (err, img) => {
              let cover = img.data.link;

              return User.findByPk(UserId).then((user) =>
                user
                  .update({
                    cover,
                    avatar,
                    name: req.body.name,
                    introduction: req.body.introduction,
                  })
                  .then(() => {
                    req.flash('successMessage', '更新成功！');
                    return res.redirect(`/users/${UserId}/tweets`);
                  }),
              );
            });
          } else {
            return User.findByPk(UserId).then((user) =>
              user
                .update({
                  avatar,
                  name: req.body.name,
                  introduction: req.body.introduction,
                })
                .then(() => {
                  req.flash('successMessage', '更新成功！');
                  return res.redirect(`/users/${UserId}/tweets`);
                }),
            );
          }
          //await User.findByPk(UserId).then(async (user) => await user.update({ avatar }));
        });
      } else if (cover != null) {
        let coverPath = cover[0].path;
        await imgur.upload(coverPath, (err, img) => {
          let cover = img.data.link;

          return User.findByPk(UserId).then((user) =>
            user
              .update({
                cover,
                name: req.body.name,
                introduction: req.body.introduction,
              })
              .then(() => {
                req.flash('successMessage', '更新成功！');
                return res.redirect(`/users/${UserId}/tweets`);
              }),
          );
        });
      } else {
        return User.findByPk(UserId).then((user) => {
          user
            .update({
              name: req.body.name,
              introduction: req.body.introduction,
            })
            .then(() => {
              req.flash('successMessage', '更新成功！');
              return res.redirect(`/users/${UserId}/tweets`);
            });
        });
      }
    }
    return User.findByPk(UserId).then((user) => {
      user
        .update({
          name: req.body.name,
          introduction: req.body.introduction,
        })
        .then(() => {
          req.flash('successMessage', '更新成功！');
          return res.redirect(`/users/${UserId}/tweets`);
        });
    });
  },
  signout: (req, res) => {
    req.flash('successScrollingMessage', '登出成功！');
    req.logout();
    res.redirect('/signin');
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
