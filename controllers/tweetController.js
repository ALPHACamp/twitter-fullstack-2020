const db = require('../models')
const Tweet = db.Tweet

const tweetController = {
  getTweets: (req, res) => {
    return res.render('tweets')
  }
}

module.exports = tweetController