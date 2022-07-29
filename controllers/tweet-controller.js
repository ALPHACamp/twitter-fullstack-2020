const assert = require('assert')
const helpers = require("../_helpers")
const { User, Tweet, Like } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: [
          User
        ],
        order: [
          ['created_at', 'DESC'],
          ['id', 'ASC']
        ],
        raw: true,
        nest: true
      })
      const likedTweetsId = req.user?.likedTweets.map(tweet => tweet.id)
      const tweetsList = tweets.map(tweet => ({
        ...tweet,
        isLiked: likedTweetsId?.includes(tweet.id)
      }))
      return res.render('tweets', { tweetsList, user })
    }
    catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      assert(description.length <= 140, "請以 140 字以內為限")
      assert((description.trim() !== ''), "內容不可空白")
      const UserId = helpers.getUser(req).id
      const createdTweet = await Tweet.create({
        UserId,
        description
      })
      assert(createdTweet, "Failed to create tweet!")
      req.flash('success_messages', '發推成功！')
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const like = await Like.findOrCreate({
        where: {
          UserId,
          TweetId
        }
      })
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const like = await Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })
      await like.destroy()
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
