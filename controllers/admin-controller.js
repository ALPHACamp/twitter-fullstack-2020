const { User, Tweet } = require('../models')

const adminController = {
  SignInPage: (req, res) => {
    return res.render('admin/signin')
  },

  SignIn: (req, res) => {
    req.flash('success_messages', 'admin 成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', 'admin 登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  GetTweets: (req, res, next) => {
    Tweet.findAll({
      include: [{
        model: User,
        attributes: ['avatar', 'name', 'account']
      }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        res.render('admin/tweets', { tweets })
      })
      .catch(err => next(err))
  },

  deleteTweet: (req, res, next) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  }
}

module.exports = adminController
