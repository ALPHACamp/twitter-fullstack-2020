const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const helpers = require('../_helpers');

const db = require('../models');
const { getUser } = require('../middleware/authenticationHelper');

const {
  Tweet, User, Reply, Like, Followship,
} = db;

const usersController = {
  registerPage: (req, res) => res.render('regist'),
  register    : (req, res) => {
    const {
      name, email, account, password, passwordCheck,
    } = req.body;
    if (!name || !email || !account || !password || !passwordCheck) {
      req.flash('error_messages', '所有欄位都是必填');
      return res.redirect('/regist');
    }
    if (passwordCheck !== password) {
      req.flash('error_messages', '兩次密碼輸入不一致');
      return res.redirect('/regist');
    }
    return User.findOne({
      where: { [Op.or]: [{ email }, { account }] },
    }).then((user) => {
      if (user) {
        if (user.account === account) {
          req.flash('error_messages', '帳號已經有人用了');
        }
        if (user.email === email) {
          req.flash('error_messages', '此 Email 已存在');
        }
        return res.redirect('/regist');
      }
      return User.create({
        email   : req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
        name    : req.body.name,
        account : req.body.account,
      }).then(() => {
        req.flash('success_messages', '成功註冊帳號');
        res.redirect('/login');
      })
      .catch((error) => console.log('register error', error));
    });
  },
  loginPage: (req, res) => {
    res.render('login');
  },

  login: (req, res) => {
    req.flash('success_messages', '登入成功');
    res.redirect('/');
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功');
    req.logout();
    res.redirect('/login');
  },

  getAccount: (req, res) => {
    User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        req.flash('error_messages', '此頁面不存在');
        res.redirect('back');
      }
      if (user.id !== req.user.id) {
        req.flash('error_messages', '無法設定他人帳戶');
        res.redirect('back');
      } else {
        res.render('setting', {
          user: user.dataValues,
        });
      }
    });
  },
  putAccount: async (req, res) => {
    const {
      name, email, account, password, passwordCheck,
    } = req.body;

    if (passwordCheck !== password) {
      req.flash('error_messages', '兩次密碼輸入不一致');
      return res.redirect(`/${req.params.id}/setting/`);
    }
    if (req.user.email !== email) {
      const userWtihSameEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (userWtihSameEmail) {
        req.flash('error_messages', 'Email 已經有人使用');
        return res.redirect(`/${req.params.id}/setting/`);
      }
    }
    if (req.user.account !== account) {
      const userWithSameAccount = await User.findOne({
        where: {
          account,
        },
      });

      if (userWithSameAccount) {
        req.flash('error_messages', '帳號已經有人使用');
        return res.redirect(`/${req.params.id}/setting/`);
      }
    }

    const changes = {};
    if (email !== '') {
      changes.email = req.body.email;
    } if (password !== '') {
      changes.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
    } if (name !== '') {
      changes.name = req.body.name;
    } if (account !== '') {
      changes.account = req.body.account;
    }
    return User.findByPk(req.params.id)
    .then((me) => {
      me.update(changes).then(() => {
        req.flash('success_messages', '成功更新');
        res.redirect('/');
      })
      .catch((error) => console.log('edit error', error));
    });
  },

  // 使用者個人推文清單
  getSelfTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        UserId: req.user.id,
      },
      include: [
        User,
        Reply,
        Like,
      ],
    })
    .then((tweets) => {
      const tweetsObj = tweets.map((tweet) => ({
        ...tweet.dataValues,
        User      : tweet.User.dataValues,
        ReplyCount: tweet.Replies.length,
        LikeCount : tweet.Likes.length,
        isLiked   : req.user.LikedTweets.map((d) => d.id).includes(tweet.id),
      }));

      return res.render('index', { user: getUser(req), selfTweets: tweetsObj });
    });
  },
  // 使用者個人推文及回覆清單
  getSelfTweetsReplies: async (req, res) => {
    // Gathered list of tweets where user tweeted and/or replied
    const [selfTweets, selfReplies] = await Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        where: {
          UserId: req.user.id,
        },
        include: [
          User,
          Reply,
          Like,
        ],
      })
      .then((tweets) => {
        const tweetsObj = tweets.map((tweet) => ({
          ...tweet.dataValues,
          User      : tweet.User.dataValues,
          ReplyCount: tweet.Replies.length,
          LikeCount : tweet.Likes.length,
          isLiked   : req.user.LikedTweets.map((d) => d.id).includes(tweet.id),
        }));
        return tweetsObj;
      }),
      Tweet.findAll({
        order  : [['createdAt', 'DESC']],
        include: [
          User,
          {
            model: Reply,
            where: {
              UserId: req.user.id,
            },
          },
          Like,
        ],
      })
      .then((tweets) => {
        const tweetsObj = tweets.map((tweet) => ({
          ...tweet.dataValues,
          User      : tweet.User.dataValues,
          ReplyCount: tweet.Replies.length,
          LikeCount : tweet.Likes.length,
          isLiked   : req.user.LikedTweets.map((d) => d.id).includes(tweet.id),
        }));

        return tweetsObj;
      }),
    ]);
    // Todo: combine together and rank based on interaction datetime, then return data
    req.flash('error_messages', 'page is still under construction!');
    return res.redirect('back');
  },
  // 使用者喜歡的內容清單
  getSelfLikes: (req, res) => {
    Tweet.findAll({
      order  : [['createdAt', 'DESC']],
      include: [
        User,
        Reply,
        Like,
      ],
    })
    .then((tweets) => {
      const tweetsObj = tweets.map((tweet) => ({
        ...tweet.dataValues,
        User      : tweet.User.dataValues,
        ReplyCount: tweet.Replies.length,
        LikeCount : tweet.Likes.length,
        isLiked   : req.user.LikedTweets.map((d) => d.id).includes(tweet.id),
      }));
      const likedTweets = tweetsObj.filter(
        (tweet) => (tweet.LikeCount > 0 && tweet.isLiked === true),
      );

      return res.render('index', { user: getUser(req), likedTweets });
    });
  },
  // 使用者編輯個人資料
  putUser: async (req, res) => {
    const {
      name, introduction,
    } = req.body;
    const cover = req.files.cover ? req.files.cover[0] : null;
    const avatar = req.files.avatar ? req.files.avatar[0] : null;

    if (name.length > 50) {
      req.flash('error_messages', '名稱不能超過50字');
      return res.redirect('/');
    }
    if (introduction.length > 160) {
      req.flash('error_messages', '自我介紹不能超過160字');
      return res.redirect('/');
    }

    if (cover || avatar) {
      const updateData = {
        name        : req.body.name,
        introduction: req.body.introduction,
      };

      if (cover) {
        const image = await helpers.uploadFile(cover);
        updateData.cover = image.link;
      }

      if (avatar) {
        const image = await helpers.uploadFile(avatar);
        updateData.avatar = image.link;
      }

      User.findByPk(req.user.id).then((me) => {
        me.update(updateData)
        .then(() => {
          req.flash('success_messages', '成功更新');
          return res.redirect('back');
        });
      });
    } else {
      User.findByPk(req.user.id).then((me) => {
        me.update({
          name        : req.body.name,
          introduction: req.body.introduction,
          cover       : me.cover,
          avatar      : me.avatar,
        }).then(() => {
          req.flash('success_messages', '成功更新');
          res.redirect('/');
        });
      });
    }
  },
};
module.exports = usersController;
