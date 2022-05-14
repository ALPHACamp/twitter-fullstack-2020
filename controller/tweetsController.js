const { Tweet, User, Reply } = require('../models')
const helpers = require('../_helpers')
const tweetsController = {
  getTweets: async (req, res, next) => {
    // TODO: like 與 replies 數量
    try {
      const tweets = await Tweet.findAll({
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        },
        raw: true,
        nest: true
      })
      const topUsers = await User.findAll({ raw: true })
      // TODO: topUsers 尚未完成，需要根據 like 術與 follower 數相加
      return res.render('index', { tweets, topUsers })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    const tweetId = Number(req.params.tweetId)

    try {
      const tweet = await Tweet.findByPk(tweetId, {
        raw: true
      })
      const replies = await Reply.findAll({
        where: { tweetId },
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        },
        raw: true,
        nest: true
      })
      const topUsers = await User.findAll({ raw: true })
      return res.render('tweet', { tweet, replies, topUsers })
    } catch (err) {
      next(err)
    }
  },
  addTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req) && helpers.getUser(req).id
    try {
      if (!description || description.trim().length === 0) throw new Error('不能發空白推！')
      if (description.length > 140) throw new Error('推文不能超過140字！')
      await Tweet.create({
        description,
        UserId
      })
      return res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  createFakePage: (req, res, next) => {
    try {
      return res.render('createFake')
    } catch (err) {
      next(err)
    }
  },
  replyFakePage: async (req, res, next) => {
    const tweetId = Number(req.params.tweetId)
    const tweet = await Tweet.findByPk(tweetId, {
      include: {
        model: User,
        attributes: ['name', 'account', 'avatar']
      },
      raw: true,
      nest: true
    })
    try {
      return res.render('replyFake', tweet)
    } catch (err) {
      next(err)
    }
  },
  addReply: async (req, res, next) => {
    const TweetId = Number(req.params.tweetId)
    const UserId = helpers.getUser(req) && helpers.getUser(req).id
    const { comment } = req.body

    try {
      if (!comment || comment.trim().length === 0) throw new Error('不能發空白回覆！')
      if (comment.length > 140) throw new Error('推文不能超過140字！')
      await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetsController
