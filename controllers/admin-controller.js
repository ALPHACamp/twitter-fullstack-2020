const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'admin 成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getTweets: (req, res, next) => {
    // 管理者頁面的推文抓取
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User],
      raw: true,
      nest: true
    })
      .then(tweets => {
        return res.render('admin/tweets', { tweets })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("tweet didn't exist!'")
        return tweet.destroy()
      })
      .then(() =>
        res.redirect('/admin/tweets')
      )
      .catch(err => next(err))
  }
}
module.exports = adminController
