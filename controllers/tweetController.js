const db = require('../models')
const Tweet = db.Tweet

const tweetController = {
  getTweets: (req, res) => {

    return Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => {
        console.log(tweets)
        return res.render('tweets', { tweets })
      })
  },
  getTweet: (req, res) => {
    return res.render('tweet')
  }
}

module.exports = tweetController