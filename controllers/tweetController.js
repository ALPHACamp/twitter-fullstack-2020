const db = require('../models')
const Tweet = db.tweet

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({ raw: true, nest: true }).then(tweets => {
      return res.render('tweets', { tweets: tweets })
    })
  }
}

module.exports = tweetController
