const adminService = require('../services/adminService')
// const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;


const adminController = {

  getSigninPage: (req, res) => {
    return res.render('admin/signin')
  },

  getTweets: (req, res) => {
    Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']],
      limit: 10,
      raw: true,
      nest: true,
    })
      .then(tweets => {
        return res.render('admin/tweets', { tweets })
      })
    // adminService.getTweets(req, res, (data) => {
    //   return res.render('admin/tweets', data)
    // })
  },

  signin: (req, res) => {
    return res.redirect('/admin/tweets')
  },
}

module.exports = adminController