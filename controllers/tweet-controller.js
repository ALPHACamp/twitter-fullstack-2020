const jwt = require('jsonwebtoken')
const { Tweet } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const tweetController = {
  getTweetReplies: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweetReply: (req, res, next) => {
    res.json({ status: 'success' })
  },
  likeTweet: (req, res, next) => {
    res.json({ status: 'success' })
  },
  unlikeTweet: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweetUnlike: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = getUser(req).id
      const description = req.body.description
      if (!description.trim()) throw new Error('推文內容不可為空白')
      if (description.length > 140) throw new Error('推文不能超過140字')
      await Tweet.create({ description, UserId })
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        raw: true,
        limit: 20
      })
      res.json({ status: 'success', tweets })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
