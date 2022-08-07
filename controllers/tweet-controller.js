const assert = require('assert')
const helpers = require("../_helpers")
const { User, Tweet, Like, Reply } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const user = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: [
          User,
          Reply,
          Like
        ],
        order: [
          ['created_at', 'DESC'],
          ['id', 'ASC']
        ],
        limit,
        offset,
      })
      const tweetsList = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: tweet.Likes.some(t => t.UserId === user.id)
      }))
      return res.render('tweets', { tweetsList, user, pagination: getPagination(limit, page, tweetsList.count) })
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
