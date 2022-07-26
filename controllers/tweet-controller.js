const assert = require('assert')
const helpers = require("../_helpers")
const { User, Tweet, Like } = require('../models')

// getTweets (進到個人首頁渲染出所有資料)/ 
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: User,
        order: [
          ['created_at', 'DESC']
        ],
        raw: true,
        nest: true
      })
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
      const newLike = await Like.findOrCreate({
        where: {
          userId,
          tweetId
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
          userId,
          tweetId
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
