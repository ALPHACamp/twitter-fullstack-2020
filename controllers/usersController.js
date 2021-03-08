const { Op } = require('sequelize');
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const helpers = require('../_helpers');
const customHelpers = require('../custom_helpers');

const db = require('../models');

const {
  Tweet, User, Reply, Like, Followship,
} = db;

const usersController = {
  registerPage: (req, res) => res.render('regist'),
  register    : (req, res) => {
    const {
      name, email, account, password, checkPassword,
    } = req.body;
    if (!name || !email || !account || !password || !checkPassword) {
      req.flash('error_messages', '所有欄位都是必填');
      return res.redirect('/signup');
    }
    if (checkPassword !== password) {
      req.flash('error_messages', '兩次密碼輸入不一致');
      return res.redirect('/signup');
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
        return res.redirect('/signup');
      }
      return User.create({
        email   : req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
        name    : req.body.name,
        account : req.body.account,
      }).then(() => {
        req.flash('success_messages', '成功註冊帳號');
        res.redirect('/signin');
      })
      .catch((error) => console.log('register error', error));
    });
  },
  loginPage: (req, res) => {
    res.render('login');
  },

  login: (req, res) => {
    req.flash('success_messages', '登入成功');
    return res.redirect('/tweets');
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功');
    req.logout();
    res.redirect('/signin');
  },

  getAccount: (req, res) => {
    User.findByPk(req.params.id)
    .then((user) => {
      if (!user) {
        req.flash('error_messages', '此頁面不存在');
        res.redirect('back');
      }
      if (user.id !== helpers.getUser(req).id) {
        req.flash('error_messages', '無法設定他人帳戶');
        res.redirect('back');
      } else {
        res.render('setting', {
          user : user.dataValues,
          title: {
            text: '帳戶設定',
          },
        });
      }
    });
  },
  putAccount: async (req, res) => {
    const {
      name, email, account, password, checkPassword,
    } = req.body;

    if (checkPassword !== password) {
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
  getTweetsPage: async (req, res) => {
    const userId = req.params.userId ? Number(req.params.userId) : helpers.getUser(req).id;
    const user = await usersController.getUserDetails(userId);

    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        UserId: userId,
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
        isLiked   : (user.LikedTweets || []).map((d) => d.id).includes(tweet.id),
      }));

      user.isFollowed = helpers.getUser(req).Followings.map((d) => d.id).includes(user.id);

      return res.render('index', {
        userPage: true,
        title   : {
          user_name       : user.name,
          user_tweetsCount: tweets.length,
        },
        user,
        selfTweets: tweetsObj,
      });
    });
  },
  // 使用者個人推文及回覆清單
  getTweetsRepliesPage: async (req, res) => {
    const userId = req.params.userId ? Number(req.params.userId) : helpers.getUser(req).id;
    const likedTweets = await usersController.getUserLikedTweets(userId);
    const user = await usersController.getUserDetails(userId);

    // Gathered list of tweets where user tweeted and/or replied
    const [selfTweets, selfReplies] = await Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        where: {
          UserId: userId,
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
          isLiked   : (likedTweets || []).map((d) => d.id).includes(tweet.id),
        }));
        return tweetsObj;
      }),

      Reply.findAll({
        order: [['createdAt', 'DESC']],
        where: {
          UserId: userId,
        },
        include: [
          {
            model  : Tweet,
            include: [User, Reply, Like],
          },
        ],
      })
      .then((replies) => {
        const tweetsObj = replies.map((reply) => ({
          id         : reply.dataValues.Tweet.id,
          UserId     : reply.dataValues.Tweet.UserId,
          description: reply.dataValues.Tweet.description,
          createdAt  : reply.dataValues.createdAt,
          updatedAt  : reply.dataValues.updatedAt,
          User       : reply.dataValues.Tweet.User.dataValues,
          ReplyCount : reply.dataValues.Tweet.Replies.length,
          LikeCount  : reply.dataValues.Tweet.Likes.length,
          isLiked    : likedTweets.map((d) => d.id).includes(reply.dataValues.Tweet.id),
        }));

        return tweetsObj;
      }),
    ]);

    const tweets = selfTweets.concat(selfReplies).sort((a, b) => b.createdAt - a.createdAt);
    const uniqueTweets = [...new Map(tweets.map((item) => [item.id, item])).values()];

    return res.render('index', {
      user,
      selfTweetsReplies: uniqueTweets,
      userPage         : true,
      title            : {
        user_name       : user.name,
        user_tweetsCount: user.tweetCount,
      },
    });
  },
  // 使用者喜歡的內容清單
  getLikesPage: async (req, res) => {
    const userId = req.params.userId ? Number(req.params.userId) : helpers.getUser(req).id;
    const [user, userLikedTweets] = await Promise.all([
      usersController.getUserDetails(userId),
      usersController.getUserLikedTweets(userId),
    ]);

    const tweetsObj = userLikedTweets.map((tweet) => ({
      ...tweet,
      ReplyCount: tweet.Replies.length,
      LikeCount : tweet.Likes.length,
      isLiked   : user.Likes.map((d) => d.TweetId).includes(tweet.id),
    }));
    return res.render('index', {
      user,
      likedTweets: tweetsObj,
      userPage   : true,
      title      : {
        user_name       : user.name,
        user_tweetsCount: user.tweetCount,
      },
    });
  },
  // 使用者的追蹤清單
  getFollowingsPage: async (req, res) => {
    const userId = Number(req.params.userId);
    const [user, userFollowings] = await Promise.all([
      usersController.getUserDetails(userId),
      usersController.getUserFollowings(helpers.getUser(req).id, req),
    ]);

    return res.render('index', {
      user,
      userFollowings,
      userPage: true,
      title   : {
        user_name       : user.name,
        user_tweetsCount: user.tweetCount,
      },
    });
  },
  // 使用者的被追蹤清單
  getFollowersPage: async (req, res) => {
    const userId = Number(req.params.userId);
    const [user, userFollowers] = await Promise.all([
      usersController.getUserDetails(userId),
      usersController.getUserFollowers(userId, req),
    ]);

    return res.render('index', {
      user,
      userFollowers,
      userPage: true,
      title   : {
        user_name       : user.name,
        user_tweetsCount: user.tweetCount,
      },
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
        const image = await customHelpers.uploadFile(cover);
        updateData.cover = image.link;
      }

      if (avatar) {
        const image = await customHelpers.uploadFile(avatar);
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

  // Helper functions
  getUserDetails: (userId) => new Promise((resolve, reject) => {
    User.findByPk(userId, {
      include: [
        { model: Tweet },
        { model: Like },
        { model: Reply },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    })
    .then((user) => {
      // Assign user analytics
      Object.assign(user.dataValues, {
        tweetCount    : user.dataValues.Tweets.length,
        replyCount    : user.dataValues.Replies.length,
        likeCount     : user.dataValues.Likes.length,
        followingCount: user.dataValues.Followings.length,
        followerCount : user.dataValues.Followers.length,
      });
      // Remove unnecessary large payload
      delete user.dataValues.Tweets;
      delete user.dataValues.Replies;

      return resolve(user.toJSON());
    });
  }),
  getUserLikedTweets: (userId) => new Promise((resolve, reject) => {
    Like.findAll({
      where: {
        UserId: userId,
      },
      include: [
        {
          model  : Tweet,
          include: [
            User,
            Reply,
            Like,
          ],
        },
      ],
    })
    .then((likes) => {
      let likedTweetsArr = likes.map((like) => ({
        ...like.Tweet,
      }));
      likedTweetsArr = likedTweetsArr.map((tweet) => ({
        ...tweet.dataValues,
        ReplyCount: tweet.Replies.length,
        LikeCount : tweet.Likes.length,
      }));
      return resolve(likedTweetsArr);
    });
  }),
  getUserFollowers: (userId, req) => new Promise((resolve, reject) => {
    User.findByPk(userId, {
      include: [
        { model: User, as: 'Followers' },
      ],
    })
    .then((user) => {
      const followersArr = user.dataValues.Followers.map((follower) => ({
        id          : follower.dataValues.id,
        email       : follower.dataValues.id,
        account     : follower.dataValues.account,
        name        : follower.dataValues.name,
        avatar      : follower.dataValues.avatar,
        introduction: follower.dataValues.introduction,
        cover       : follower.dataValues.cover,
        role        : follower.dataValues.role,
        createdAt   : follower.dataValues.Followship.dataValues.createdAt,
        isFollowed  : req.user.Followings.map((d) => d.id).includes(follower.id),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

      return resolve(followersArr);
    });
  }),
  getUserFollowings: (userId, req) => new Promise((resolve, reject) => {
    User.findByPk(userId, {
      include: [
        { model: User, as: 'Followings' },
      ],
    })
    .then((user) => {
      const followingsArr = user.Followings.map((following) => ({
        id          : following.dataValues.id,
        email       : following.dataValues.id,
        account     : following.dataValues.account,
        name        : following.dataValues.name,
        avatar      : following.dataValues.avatar,
        introduction: following.dataValues.introduction,
        cover       : following.dataValues.cover,
        role        : following.dataValues.role,
        createdAt   : following.dataValues.Followship.dataValues.createdAt,
        isFollowed  : req.user.Followings.map((d) => d.id).includes(following.id),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

      return resolve(followingsArr);
    });
  }),
  getTopFollowing: (req) => new Promise((resolve, reject) => {
    User.findAll({
      where: {
        role: { [Op.ne]: 'admin' },
        id  : { [Op.ne]: helpers.getUser(req).id },
      },
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.FollowingId = User.id)'), 'FollowshipCount']],
      },
      order: [[sequelize.literal('FollowshipCount'), 'DESC']],
      limit: 10,
    }).then((users) => {
      users = users.map((user) => ({
        ...user.dataValues,
        isFollowed: req.user.Followings.map((d) => d.id).includes(user.id),
      }));

      return resolve(users);
    });
  }),

};
module.exports = usersController;
