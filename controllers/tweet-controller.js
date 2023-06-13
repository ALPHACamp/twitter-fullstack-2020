const { Tweet, User, Reply, Like } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({ raw: true, nest: true, include: [User] })
      const user = await User.findByPk(req.user.id, { raw: true, nest: true })
      const userAvatar = user.avatar
      const sortedTweets = tweets.sort((a, b) => b.createdAt - a.createdAt)
      return res.render('tweets', { tweets: sortedTweets, user, userAvatar })
    } catch (err) {
      next(err)
    }
  },
  getTweetReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, { raw: true, nest: true, include: [User] })
      const replies = await Reply.findAll({ where: { Tweet_id: req.params.id }, include: [User, { model: Tweet, include: User }], raw: true, nest: true })
      const likes = await Like.findAll({ where: { Tweet_id: req.params.id }, raw: true, nest: true })
      const replyQuantity = replies.length
      const likeQuantity = likes.length
      return res.render('reply-list', { tweet, replies, replyQuantity, likeQuantity })
    } catch (err) {
      next(err)
    }
  },
  postTweetReply: async (req, res, next) => {
    try {
      const { comment, tweetId } = req.body
      const userId = req.user.id
      console.log(req)
      if (!comment) throw new Error('內容不可為空白')
      const tweet = await Tweet.findByPk(tweetId)
      const user = await User.findByPk(userId)
      if (!tweet) throw new Error('推文不存在')
      if (!user) throw new Error('使用者不存在')
      await Reply.create({
        comment,
        userId,
        tweetId
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const userId = req.user.id
      console.log(req)
      if (!description) throw new Error('內容不可為空白')
      if (description.length > 140) throw new Error('內容不可超過140字')
      const user = await User.findByPk(userId)
      if (!user) throw new Error('使用者不存在')
      await Tweet.create({
        description,
        userId
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
