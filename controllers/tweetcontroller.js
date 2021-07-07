const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const tweetController = {
  getTweets: (req, res) => {
    res.render('tweets')
  }
}

module.exports = tweetController
