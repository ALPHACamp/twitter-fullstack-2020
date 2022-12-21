
const { assert } = require('chai')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply
const helpers = require('../_helpers')

const tweetController = {
  // 首頁的推文抓取
  getTweets: (req, res, next) => {
    return Promise.all([
      Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User, Like],
        nest: true
      }),
      User.findAll({
        where: { role: 'user' }
      })
    ])
      .then(([tweets, userData]) => {
        const user = helpers.getUser(req)
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.description.substring(0, 140),
          User: t.User.dataValues,
          user,
          isLiked: t.Likes.some(f => f.UserId === user.id)
        }))
        res.render('tweets', {
          tweets: data, user
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
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
    Like.create({
      UserId,
      TweetId
    }).then(() => {
      res.redirect('back')
    })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const TweetId = req.params.id

    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId
      }
    }).then(like => {
      return like.destroy()
        .then(() => {
          res.redirect('back')
        })
    })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    Tweet.findByPk(req.params.id, {
      include: [User, { model: Reply, include: User }],
      nest: true
    })
      .then(tweet => {
        if (!tweet) throw new Error("貼文不存在")
        res.render('replies', {
          tweet: tweet.toJSON()
        })
      })
      .catch(err => next(err))
  },
  createReply: async (req, res, next) => {
    try {
      const { comment, TweetId } = req.body
      assert((comment.trim() !== ''), '內容不能空白')
      const UserId = helpers.getUser(req).id
      await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
 }
} 
module.exports = tweetController
