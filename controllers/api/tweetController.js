const db = require('../../models')
const Tweet = db.Tweet
const tweetService = require('../../services/tweetService.js')

let tweetController = {
  postTweets:(req, res) => {
    tweetService.postTweets(req, res, (data) => 
    { return res.status(200).json(data) })
  },
}

module.exports = tweetController