const { Tweet, User } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({ raw: true, nest: true, include: [User] })
      const sortedTweets = tweets.sort((a, b) => b.createdAt - a.createdAt)
      return res.render('tweets', { tweets: sortedTweets })
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (res, req, nex) => {}
}

module.exports = tweetController
