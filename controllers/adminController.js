const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  //admin登入
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  //admin管理推文
  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true, nest: true, include: [User] }).then((tweets) => {
      //console.log(tweets)
      return res.render('admin/tweets', { tweets })
    })
  },

  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then(() => {
        res.redirect('/admin/tweets')
      })
    })
  },

  //admin管理使用者
  getUsers: (req, res) => {
    return Tweet.findAll({ raw: true, nest: true, include: [User] }).then((tweets) => {
      //console.log(tweets)
      return res.render('admin/tweets', { tweets })
    })
    return res.render('admin/users')
  },
}
module.exports = adminController
