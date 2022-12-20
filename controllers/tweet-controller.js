
const { assert } = require('chai')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  // 首頁的推文抓取
  getTweets: (req, res, next) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Like],
      raw: true,
      nest: true
    })
      .then((tweets) => {
        // if (!tweets.Likes) throw new Error("tweets didn't exist!")
        const isLiked = tweets.Likes.some(t => t.UserId === helpers.getUser(req).id)
        res.render('tweets', {
          tweets, isLiked
        })
      })
      .catch(err => next(err))
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      assert(description.length <= 140, '字數140內')
      assert((description.trim() !== ''), '內容不能空白')
      const UserId = helpers.getUser(req).id
      const createdTweet = await Tweet.create({
        UserId,
        description
      })
      assert(createdTweet, 'Failed to create tweet!')
      req.flash('success_messages', '成功推文!')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  addLike: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    return Like.findOrCreate({
      where: {
        UserId,
        TweetId
      },
      raw: true,
      nest: true
    })
      .then((like) => {
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    return Like.findOne({
      where: {
        UserId,
        TweetId
      },
      raw: true,
      nest: true
    })
      .then((like) => {
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = tweetController
