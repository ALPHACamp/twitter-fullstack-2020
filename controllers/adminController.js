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
      tweets = tweets.map((r) => {
        return {
          ...r,
          description: r.description.length > 50 ? r.description.substring(0, 50) + '...' : r.description,
        }
      })
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
    //return User.findAll({ raw: true, nest: true, include: [User] }).then((users) => {
    return User.findAll({ raw: true, nest: true }).then((users) => {
      console.log(users)
      users = users.filter((user) => user.role === 'user')
      return res.render('admin/users', { users })
    })
  },
}
module.exports = adminController
