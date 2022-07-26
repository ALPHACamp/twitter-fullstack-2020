const assert = require('assert')
const helpers = require("../_helpers")
const { User, Tweet, Like, Reply } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: [
          User,
          { model: User, as: 'LikedUsers' }
        ],
        order: [
          ['created_at', 'DESC']
        ],
        raw: true,
        nest: true
      })
      console.log(tweets)
      return res.render('tweets', { tweets, user })
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
      const userId = helpers.getUser(req).id
      const createdTweet = await Tweet.create({
        userId,
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
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      await Like.findOrCreate({
        where: {
          UserId: userId,
          TweetId: tweetId
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
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      const like = await Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
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
