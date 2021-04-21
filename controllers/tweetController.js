const db = require('../models')
const Tweet = db.Tweet

const tweetController = {
  getTweets: (req, res) => {
    return res.send('TWEETS')
  }
}

module.exports = tweetController