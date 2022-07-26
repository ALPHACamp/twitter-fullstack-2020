// admin頁面各種 signin/ getuser/ gettweet/ deletetweet/ logout
const { User, Tweet } = require('../models')
const adminController = {
  signInPage: (req, res) => {
    res.render('admin/signin')
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
  getAdminTweets: (req, res) => {
    return res.render('admin/tweets')
  },
  getAdminUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => {
        console.log(users)
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  getAdminTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']],
    })
      .then(tweets => {
        tweets = tweets.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
        }))
        console.log(tweets)
        return res.render('admin/tweets', { tweets })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
      })
      .then(() => {
        res.redirect('/admin/tweets')
      })
      .catch(err => next(err))
  },
}

module.exports = adminController
