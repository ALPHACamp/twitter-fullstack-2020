const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          User,
          { model: Like, include: User, where: { UserId: helpers.getUser(req).id } }
        ],
        order: [['createdAt', 'DESC']]
      })
      tweets = await tweets.rows.map(tweet => ({
        ...tweet.toJSON(),
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        isLiked: tweet.Likes.User.some(
          l => l.id === tweet.id
        )
        //可能要換成 helpers.getUser(req).id
      }))
      return res.render('tweets', { tweets })
    }
    catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id,
        {
          include: [
            User,
            { model: Reply, include: User },
            { model: Like, include: User, where: { UserId: helpers.getUser(req).id } }
          ]
        })
      if (!tweet) {
        req.flash('error_messages', 'Tweet 不存在!')
        return res.redirect('back')
      }
      const likedCount = tweet.Likes.length
      const repliedCount = tweet.Replies.length
      const isLiked = tweet.Likes.User.some(
        l => l === tweet.id
      )
      return res.render('tweet', { tweet: tweet.toJSON(), likedCount, repliedCount, isLiked })
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description) {
        req.flash('error_messages', 'Tweet 內容不存在!')
        return res.redirect('back')
      }
      if (description.trim() === '') {
        req.flash('error_messages', 'Tweet 內容不能為空！')
        return res.redirect('back')
      }
      if (description && description.length > 140) {
        req.flash('error_messages', 'Tweet 內容不能超過140字!')
        return res.redirect('back')
      }
      await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      req.flash('success_messages', '成功新增Tweet!')
      return res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  postLike: async (req, res, next) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      })
      req.flash('success_messages', '成功 Like!')
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const like = await Like.fineOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_id
        }
      })
      if (!like) return req.flash('error_messages', '你沒有like這個tweet!')
      await like.destroy()
      req.flash('success_messages', '成功 Unlike!')
      return res.redirect('back')
    }
    catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
