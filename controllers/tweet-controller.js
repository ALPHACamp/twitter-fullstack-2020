const jwt = require('jsonwebtoken')
const { Tweet, User, Like, Followship } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweetReplies: async (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweetReply: async (req, res, next) => {
    res.json({ status: 'success' })
  },
  likeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const existUser = User.findByPk(UserId)
      if (!existUser) throw new Error("This account didn't exist!")
      const LikeTweet = await Like.findOne({ where: { UserId, TweetId } })
      if (LikeTweet) throw new Error('You already liked this tweet!')
      Like.create({ UserId, TweetId })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  dislikeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const LikeTweet = await Like.findOne({ where: { UserId, TweetId } })
      if (!LikeTweet) throw new Error("You haven't liked this tweet!")
      LikeTweet.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  postTweetUnlike: (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      if (!UserId) {
        return res.redirect(302, '/signin')
      }
      const description = req.body.description
      if (!description.trim()) throw new Error('推文內容不可為空白')
      if (description.length > 140) {
        return res.redirect(302, 'back')
      }
      await Tweet.create({ description, UserId })
      res.redirect('/tweets')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const followingId = user.Followings.map(i => i.id)
      const tweets = await Tweet.findAll({
        include: { model: User, as: User },
        where: { UserId: [...followingId, user.id] },
        order: [['createdAt', 'DESC']],
        limit: 20,
        raw: true,
        nest: true
      })
      const likedTweetsId = req.user?.Likes
        ? req.user.Likes.map(lt => lt.TweetId)
        : []
      const data = tweets.map(tweets => ({
        ...tweets,
        isLiked: likedTweetsId.includes(tweets.id)
      }))
      res.render('tweets', { tweets: data })
      // res.json({ status: 'success', tweets: data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
