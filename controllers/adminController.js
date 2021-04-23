const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers');
const User = db.User
const Tweet = db.Tweet;

const adminController = {
  signinPage:(req,res)=>{
    const adminMark = "admin"
    return res.render('signin', { adminMark})
  },
  signin:async (req,res)=>{
    const user = await User.findOne({ account: req.body.account})

    if (user.dataValues.isAdmin){
      res.redirect('tweets')
    }else{
      req.flash('error_msg', '此帳號不是管理者')
      res.render('signin')
    }
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