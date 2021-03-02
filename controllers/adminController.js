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
};
module.exports = usersController;
