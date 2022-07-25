const { User, Tweet } = require('../models')

const adminController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({ include: User, raw: true, nest: true }).then(tweets => {
      // res.send(tweets)
      res.render('admin_tweets', { tweets })
    })
  },
  getUsers: (req, res, next) => {
    User.findAll({ raw: true }).then(users => {
      // res.send(users)
      res.render('admin_users', { users })
    })
  }
}

module.exports = adminController
