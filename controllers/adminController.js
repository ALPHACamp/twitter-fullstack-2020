const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const bcrypt = require('bcryptjs')

const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '成功登入！')
    res.redirect('/admin/tweets')
  },

  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['createdAt', 'DESC']
      ]
    })
      .then(tweets => {
        const data = tweets.map(r => {
          r.description = r.description.substring(0, 50)
          return r
        })
        return res.render('admin/tweets', { tweets: data })
      })
  },

  getUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true,
      where: { role: 'user' },
      include: [ Like ],
      order: [
        ['tweetCount', 'DESC']
      ]
    })
      .then(users => {
        Like.findAll({
          raw: true,
          nest: true
        })
        .then(likes => {
           console.log(likes)
        return res.render('admin/users', { users })
        })
      })
  },

  deleteTweets: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then((tweet) => {
            res.redirect('/admin/tweets')
          })
      })
  }
}

module.exports = adminController