const { User, Tweet, Like } = require('../models')

const adminController = {
  signinPage: (req, res, next) => {
    res.render('admin_signin')
  },

  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin/tweets')
  },

  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/admin/signin')
  },

  getTweets: (req, res, next) => {
    Tweet.findAll({ include: User, raw: true, nest: true }).then(tweets => {
      // res.send(tweets)
      res.render('admin_tweets', { tweets })
    })
  },
  getUsers: (req, res, next) => {
    User.findAll({
      nest: true,
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(users => {
      const result = users.map(user => {
        return {
          ...user.toJSON(),
          tweetsCount: user.Tweets.length,
          likesCount: user.Tweets.reduce((acc, cur) => acc + cur.Likes.length, 0),
          followersCount: user.Followers.length,
          followingsCount: user.Followings.length
        }
      })
      // res.send(users)
      res.render('admin_users', { users: result })
    })
  }
}

module.exports = adminController
