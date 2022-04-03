const { Tweet, User, Like } = require('../models')
const helpers = require('../_helpers')

const adminController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          content: t.content.substring(0, 50)
        }))
        return res.render('admin/tweets', { tweets: data, url: req.originalUrl })
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('admin/signin', { url: req.originalUrl })
  },
  signIn: (req, res) => {
    if (helpers.getUser(req).role === null) {
      req.flash('error_messages', '請從前台登入')
      req.logout()
      return res.redirect('/signin')
    }
    req.flash('success_messages', 'Admin login successfully')
    return res.redirect('/admin/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully')
    req.logout()
    return res.redirect('/admin/signin')
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet doesn't exist!")
        return tweet.destroy()
      })
      .then(() => res.redirect('/admin/tweets'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      nest: true,
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        const data = users.map(user => ({
          ...user.toJSON()
        }))
        return res.render('admin/users', { users: data, url: req.originalUrl })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
