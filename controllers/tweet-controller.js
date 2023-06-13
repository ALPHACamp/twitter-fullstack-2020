const { getTop10Following } = require('../helpers/getTop10Following-helper')
const { Tweet, User, Reply, Like } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    const tweetRoute = true
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User]
      })
      const top10Followers = await getTop10Following(req, next)
      const sortedTweets = tweets.sort((a, b) => b.createdAt - a.createdAt)
      return res.render('tweets', {
        tweets: sortedTweets,
        topFollowers: top10Followers,
        tweetRoute
      })
    } catch (err) {
      next(err)
    }
  },
  getTweetReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [User]
      })
      const replies = await Reply.findAll({
        where: { Tweet_id: req.params.id },
        include: [User, { model: Tweet, include: User }],
        raw: true,
        nest: true
      })
      const likes = await Like.findAll({
        where: { Tweet_id: req.params.id },
        raw: true,
        nest: true
      })
      const replyQuantity = replies.length
      const likeQuantity = likes.length
      return res.render('reply-list', {
        tweet,
        replies,
        replyQuantity,
        likeQuantity
      })
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
  }
}

module.exports = tweetController
