const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers');
const User = db.User
const Tweet = db.Tweet;

const adminController = {
  signinPage: (req, res) => {
    const adminMark = "admin"
    return res.render('signin', { adminMark })
  },
  signin:(req, res) => {
     User.findOne({where:{ account: req.body.account }})
    .then((user)=>{
      if (user.dataValues.isAdmin) {
        return res.render('admin/tweets')
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
    return res.render('admin/users')
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