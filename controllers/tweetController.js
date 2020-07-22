const db = require('../models')
const Tweet = db.tweet

const tweetController = {
  getTweets: (req, res) => {
    res.render('tweets')
  }
}

module.exports = tweetController
