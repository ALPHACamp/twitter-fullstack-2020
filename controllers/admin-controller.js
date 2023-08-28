const { User, Tweet } = require('../models')

const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
  },
  signIn: (req, res) => {
    if (req.user.role === 'user') {
      req.flash('error_messages', '帳號不存在！')
      res.redirect('/admin/signin')
    } else {
      req.flash('success_messages', '成功登入')
      res.redirect('/admin/tweets')
    }
  },
  logOut: (req, res) => {
    req.flash('success_messages', '成功登出')
    res.redirect('/signin')
  },
  getTweets: (req, res, next) => {
    const tweetRoute = true
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [
        ['created_at', 'DESC']
      ]
    })
      .then(tweets => {
        if (!tweets) throw new Error('Tweets do not exist!')
        res.render('admin/tweets', { tweets, tweetRoute })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error('The tweet did not exist!')
        tweet.destroy()
      })
      .then(() => {
        res.redirect('/admin/tweets')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
