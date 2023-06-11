const { Tweet, User, Reply } = require('../models')

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
  getTweetReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, { raw: true, nest: true, include: [User] })
      const replies = await Reply.findAll({ where: { Tweet_id: req.params.id }, include: [User, { model: Tweet, include: User }], raw: true, nest: true })
      const replyQuantity = replies.length
      return res.render('reply-list', { tweet, replies, replyQuantity })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
