const jwt = require('jsonwebtoken')
const { Tweet, User, Like, Followship, Reply } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweetReplies: async (req, res, next) => {
    res.json({ status: 'success' })
  },
  postTweetReply: async (req, res, next) => {
    res.json({ status: 'success' })
  },
  likeTweet: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const TweetId = req.params.id
      const existUser = User.findByPk(UserId)
      if (!existUser) throw new Error("This account didn't exist!")
      const LikeTweet = await Like.findOne({ where: { UserId, TweetId } })
      if (LikeTweet) throw new Error('You already liked this tweet!')
      await Like.create({ UserId, TweetId })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const TweetId = req.params.id
      const LikeTweet = await Like.findOne({ where: { UserId, TweetId } })
      if (!LikeTweet) throw new Error("You haven't liked this tweet!")
      await LikeTweet.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const userAvatar = req.user.avatar
      if (!UserId) {
        return res.redirect(302, '/signin')
      }
      const description = req.body.description
      if (!description.trim()) throw new Error('推文內容不可為空白')
      if (description.length > 140) {
        return res.redirect(302, 'back')
      }
      await Tweet.create({ description, UserId, userAvatar })
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const role = currentUser.role
      let topUser = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      topUser = topUser
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: currentUser.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'description', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
        ]
      })
      const likedTweetsId = req.user?.Likes
        ? req.user.Likes.map(lt => lt.TweetId)
        : []
      const data = tweets.map(tweets => ({
        ...tweets.toJSON(),
        isLiked: likedTweetsId.includes(tweets.id)
      }))
      // res.json(tweets)
      res.render('tweets', { tweets: data, role, topUser, currentUser})
      // res.json({ status: 'success', tweets: data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
