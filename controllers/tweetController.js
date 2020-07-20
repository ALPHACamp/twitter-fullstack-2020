const db = require('../models')
const Tweet = db.Tweet

const tweetController = {
    getTweets: (req, res) => {
      return res.render('tweetsHome')
    },
    getTweet: async (req, res) => {
      const id = req.params.id
      const tweet = await Tweet.findOne({id})
      console.log(tweet)
      res.render('tweet')
    }
  }
  module.exports = tweetController