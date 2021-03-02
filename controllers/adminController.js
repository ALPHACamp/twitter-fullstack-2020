const { Op } = require('sequelize');
const db = require('../models');

const {
  Tweet, User, Like,
} = db;

const usersController = {
  adminLoginPage: (req, res) => res.render('login', { adminLogin: true }),
  adminLogin    : (req, res) => res.redirect('/admin_main'),
  adminMain     : (req, res) => {
    Tweet.findAll({
      raw    : true,
      nest   : true,
      include: [User],
      order  : [
        ['updatedAt', 'DESC'],
      ],
    })
    .then((tweets) => {
      tweets = tweets.map((tweet) => ({
        id         : tweet.id,
        description: tweet.description.slice(0, 49),
        createdAt  : tweet.createdAt,
        updatedAt  : tweet.updatedAt,
        User       : {
          id     : tweet.User.id,
          account: tweet.User.account,
          name   : tweet.User.name,
          avatar : tweet.User.avatar,
        },
      }));
      res.render('admin', { tweets });
    });
  },
  adminUsers: (req, res) => {
    User.findAll({
      where: {
        role: {
          [Op.not]: 'admin',
        },
      },
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
      ],
    })
    .then((users) => {
      const usersObj = users.map((user) => ({
        ...user.dataValues,
        tweetCount    : user.Tweets.length,
        likeCount     : user.Likes.length,
        followerCount : user.Followers.length,
        followingCount: user.Followings.length,
      }))
      .sort((a, b) => b.tweetCount - a.tweetCount);

      res.render('admin', { users: usersObj });
    });
  },
  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id)
    .then((tweet) => {
      tweet.destroy()
      .then(() => {
        req.flash('success_messages', 'Tweet has been deleted successfully');
        return res.redirect('/admin_main');
      });
    })
    .catch((e) => {
      console.error(e);
    });
  },
};
module.exports = usersController;
