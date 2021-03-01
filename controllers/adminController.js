const db = require('../models')
const User = db.User
const Tweet = db.Tweet


const adminController = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },
  signIn: (req, res) => {
    return res.render('admin/main')
  },
  getTweets: (req, res) => {
    return Tweet.findAll({ raw: true, nest: true }).then(tweets => {
      const data = tweets.map(t => {
        t.description = t.description.substring(0, 50)
        return t
      })
      return res.render('admin/tweets', { tweets: data })
    })
  },
  deleteTweet: (req, res) => {
    return Tweet.findById(req.params.id)
      .then((tweets) => {
        tweets.destroy()
          .then((tweets) => {
            res.redirect('/admin/tweets')
          })
      })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true, nest: true }).then(users => {
      return res.render('admin/users', { users: users })
    })
  },
}

module.exports = adminController