const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers');
const User = db.User
const Tweet = db.Tweet;
const Like = db.Like;

const adminController = {
  signinPage: (req, res) => {
    const adminMark = "admin"
    return res.render('signin', { adminMark })
  },
  signin: (req, res) => {
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user.dataValues.role.match('admin')) {
          return res.redirect('/admin/tweets')
        } else {
          req.flash('error_msg', '此帳號不是管理者')
          res.redirect('/signin')
        }
      })
  },
  tweetsPage: (req, res) => {
    return Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        description: tweet.dataValues.description.split(" ", 50).join(" ")
      }))
      return res.render('admin/tweets', { tweets })
    })
  },
  usersPage: (req, res) => {
   User.findAll({
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
      ]
    }).then(user => {
      user = user.map(user => ({
        ...user.dataValues,
        TweetsCount: user.Tweets.length,
        LikesCount: user.Likes.length
      }))
      user = user.sort((a, b) => b.TweetsCount - a.TweetsCount)
      return res.render('admin/users', { user })
    })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(tweet => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = adminController