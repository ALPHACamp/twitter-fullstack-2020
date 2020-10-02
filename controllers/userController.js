const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;

const userController = {
  getSigninPage: (req, res) => {
    return res.render('signin');
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
      console.log('self@@@@', req.user);
      console.log('user@@@@', user.toJSON());
      return res.render('user', { user: user.toJSON(), self: req.user });
    });
  },
};

module.exports = userController;
