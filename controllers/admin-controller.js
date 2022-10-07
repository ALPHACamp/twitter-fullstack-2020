const { User, Tweet, Like, Reply } = require('../models')
const { getUser } = require('../_helpers')

const adminController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      raw: true,
      nest: true,
      order: [['created_at', 'DESC']] // 反序
    }).then(tweets => {
      const result = tweets.map(tweet => {
        return {
          ...tweet,
          description: tweet.description.substring(0, 50)
        }
      })
      res.render('admin/tweets', { tweets: result })
    })
  },
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res, next) => {
    if (getUser(req).role === 'user') {
      req.flash('error_messages', '請前往前台登入')
      return res.redirect('/admin/signin')
    }

    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  usersPage: (req, res) => {
    res.render('admin/users')
  }
}

module.exports = adminController
