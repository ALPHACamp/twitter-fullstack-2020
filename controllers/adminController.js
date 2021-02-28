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
      return res.render('admin/tweets', { tweets: tweets })
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
  }
}

module.exports = adminController