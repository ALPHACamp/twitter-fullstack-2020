const { User, Tweet, Reply, Followship, Like } = require('../../models')
const dateFormatter = require('../../helpers/dateFormatter')
const helpers = require('../../_helpers')
const tweetController = {

  getLikeCount: async (req, res) => {
    const tweetId = req.params.id
    try {
      const tweet = await Tweet.findByPk(tweetId, {
        include: {
          model: User,
          as: 'LikedUsers'
        }
      })
      const likeCount = tweet.LikedUsers.length
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
      const tweetId = req.params.id
      let tweet = await Tweet.findByPk(tweetId)
      const like = await Like.findOne({ where: { userId: helpers.getUser(req).id, tweetId } })
      if (!tweet) throw new Error("Tweet doesn't exist!")
      if (!like) {
        await Like.create({ userId: helpers.getUser(req).id, tweetId })
      }
      tweet = await Tweet.findByPk(tweetId, {
        include: {
          model: User,
          as: 'LikedUsers'
        }
      })
      const likeCount = tweet.LikedUsers.length
      const isLiked = tweet.LikedUsers.some(lu => lu.id === helpers.getUser(req).id)
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
      const tweetId = req.params.id
      const like = await Like.findOne({
        where: { userId: helpers.getUser(req).id, tweetId }
      })
      if (like) await like.destroy()
      const tweet = await Tweet.findByPk(tweetId, {
        include: {
          model: User,
          as: 'LikedUsers'
        }
      })
      const likeCount = tweet.LikedUsers.length
      const isLiked = tweet.LikedUsers.some(lu => lu.id === helpers.getUser(req).id)
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
      if (req.body.tweet.length > 140) throw new Error("推文長度上限為 140 個字元！")
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
