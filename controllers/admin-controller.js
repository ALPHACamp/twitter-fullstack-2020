const { Tweet, User } = require('../models')
const adminController = {
  signInPage: (req, res) => {
    res.render('admins/signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '管理員成功登入！')
    res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '管理員登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },
  getAdminTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({ include: User, raw: true, nest: true, order: [['createdAt', 'DESC']] })
      tweets.forEach(tweet => {
        tweet.description = tweet.description.substring(0, 50)
      })
      res.render('admins/tweets', {
        tweets
      })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      await Tweet.destroy({
        where: { id: req.params.tweetId }
      })
      res.redirect('/admin/tweets')
    } catch (err) {
      next(err)
    }
  },
  getAdminUsers: async (req, res, next) => {
    try {
      const users = await User.findAll()
      res.render('admins/users', { users: users.toJSON() })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
