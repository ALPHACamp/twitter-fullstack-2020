const { User, Tweet, Reply, Followship, Like } = require('../../models')
const dateFormatter = require('../../helpers/dateFormatter')
const helpers = require('../../_helpers')
const tweetController = {
  getTweet: async (req, res) => {
    try {
      let tweet = await Tweet.findByPk(req.params.id, {
        include: { model: User },
        nest: true
      })

      tweet = tweet.toJSON()
      dateFormatter(tweet, 8)
      res.status(200).json({
        tweet
      })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  },

  getLikeCount: async (req, res) => {
    const tweetId = req.params.id
    try {
      const tweet = await Tweet.findByPk(tweetId, {
        include: {
          model: Like,
        }
      })
      const likeCount = tweet.Likes.length
      res.status(200).json({
        likeCount
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: error.message
      })
    }
  },
  addLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      let tweet = await Tweet.findByPk(TweetId)
      const like = await Like.findOne({ where: { userId: helpers.getUser(req).id, TweetId } })
      if (!tweet) throw new Error("Tweet doesn't exist!")
      if (!like) {
        await Like.create({ UserId: helpers.getUser(req).id, TweetId })
      }
      tweet = await Tweet.findByPk(TweetId, {
        include: {
          model: Like,
        }
      })
      const likeCount = tweet.Likes.length
      const isLiked = tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)
      res.status(200).json({
        likeCount,
        isLiked
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: error.message
      })
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const like = await Like.findOne({
        where: { UserId: helpers.getUser(req).id, TweetId }
      })
      if (like) await like.destroy()
      const tweet = await Tweet.findByPk(TweetId, {
        include: {
          model: Like,
        }
      })
      const likeCount = tweet.Likes.length
      const isLiked = tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)
      res.status(200).json({
        likeCount,
        isLiked
      })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }
  },

  postTweet: async (req, res, next) => {
    try {
      if (!req.body.tweet) throw new Error("推文不可為空白")
      if (req.body.tweet.length > 140) throw new Error(" 推文長度上限為140 個字元！")
      await Tweet.create({ UserId: helpers.getUser(req).id, description: req.body.tweet })
      const tweet = await Tweet.findOne({
        where: { UserId: helpers.getUser(req).id, description: req.body.tweet }
      })
      if (!tweet) throw new Error("推文失敗！")
      res.status(200).json({
        message: "推文成功！"
      })

    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  },
  postReply: async (req, res, next) => {
    try {
      if (!req.body.reply) throw new Error("回覆不可為空白")
      if (req.body.reply.length > 140) throw new Error("回覆長度上限為 140 個字元！")
      await Reply.create({ UserId: helpers.getUser(req).id, TweetId: req.params.id, comment: req.body.reply })
      const reply = await Reply.findOne({
        where: { UserId: helpers.getUser(req).id, TweetId: req.params.id, comment: req.body.reply }
      })
      if (!reply) throw new Error("回覆失敗！")
      res.status(200).json({
        message: "回覆成功！"
      })

    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }



  // postReply: (req, res, next) => {

  // },

  // addLike: (req, res, next) => {

  // },

  // removeLike: (req, res, next) => {

  // },

  // addFollowing: (req, res, next) => {

  // },

  // removeFollowing: (req, res, next) => {

  // },
}
module.exports = tweetController
