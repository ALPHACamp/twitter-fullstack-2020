const db = require('../models')
const User = db.User
const Tweet = db.Tweet


module.exports = {
  signInPage: (req, res) => {
    return res.render('admin/signin')
  },

  getTweets: (req, res) => {
    Tweet.findAll({ include: [User] }).then(tweets => {
      tweets = tweets.map((t, _) => ({
        ...t.dataValues,
        description: t.description.substring(0, 50)
      }))

      res.render('admin/tweets', {
        tweets
      })
    })
  }
}