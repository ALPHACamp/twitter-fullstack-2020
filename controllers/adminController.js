const db = require('../models')
const { Reply, User, Tweet, Like, } = db

const helpers = require("../_helpers.js");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

const listAttributes = [
  "id", "name", "account", "introduction", "avatar",
];

const adminController = {
  signInPage: (req, res) => {
    return res.render("admin/signin");
  },

  signIn: (req, res) => {
    if (req.user.role === 'admin') {
      console.log('signIn')
      return res.redirect('/admin/tweets');
    }
    // req.flash('error_messages', '沒有權限');
    req.logout();
    return res.redirect('/signin');
  },
  signOut: (req, res) => {
    //  req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getPosts: (req, res) => {
    return Tweet.findAll({
      include: [
        { model: User, Attributes: listAttributes }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        description: t.description.substring(0, 50),
      }))

      // return res.json(data)
      return res.render('admin/tweets', { tweet: data, isadmin: req.user.role })
    })
      .catch((error) => res.status(400).json(error));
  },

  deletePost: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then(() => {
        // return res.json({ status: 'success', tweet })
        return res.redirect('/admin/tweets')
      })
    })
      .catch((error) => res.status(400).json(error));
  },

  getUsers: (req, res) => {
    return User.findAll({
      Attributes: ['id', 'name', 'account', 'cover', 'avatar'],
      include: [
        { model: Reply, Attributes: ['id'] },
        { model: Tweet, Attributes: ['id'] },
        { model: Like, Attributes: ['id'] },
        { model: User, as: 'Followers', Attributes: ['id'] },
        { model: User, as: 'Followings', Attributes: ['id'] }
      ]
    }).then(users => {
      const data = users.map(data => ({
        ...data.dataValues,
        TweetCount: data.Tweets.length,
        ReplyCount: data.Replies.length,
        LikedCount: data.Likes.length,
        FollowersCount: data.Followers.length,
        FollowingsCount: data.Followings.length
      }))
      data.sort((a, b) => b.TweetCount - a.TweetCount)
      // return res.json(data)
      return res.render('admin/users', { user: data, isadmin: req.user.role })
    })
      .catch((error) => res.status(400).json(error));
  }
}

module.exports = adminController