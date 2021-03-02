const { Op } = require('sequelize');
const db = require('../models');

const {
  Tweet, User, Like,
} = db;

const usersController = {
  adminLoginPage: (req, res) => res.render('login', { adminLogin: true }),
  adminLogin    : (req, res) => res.redirect('/admin_main'),
  adminMain     : (req, res) => {
    res.render('admin');
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
