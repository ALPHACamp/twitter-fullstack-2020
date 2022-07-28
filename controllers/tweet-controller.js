const { Tweet, User, Like, Followship, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweetReplies: async (req, res, next) => {
    try {
      const followerId = req.user.Followers.map(fu => fu.id)
      const TweetId = req.params.id
      const existTweet = Tweet.findByPk(TweetId)
      if (!existTweet) throw new Error("This tweet didn't exist!")
      const replies = await Reply.findAll({
        where: { TweetId },
        include: [{ model: User }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      const data = replies.map(reply => ({
        ...reply,
        isFollowed: followerId.includes(reply.userId)
      }))
      return res.render('tweets/tweet-replies', { replies: data })
    } catch (err) {
      next(err)
    }
  },
  postTweetReply: async (req, res, next) => {
    const UserId = req.user.id
    const comment = req.body.comment
    const TweetId = req.params.id
    const existTweet = Tweet.findByPk(TweetId)
    if (!existTweet) {
      req.flash('error_messages', '這個推文已經不存在！')
      res.redirect('/')
    }
    if (!comment) {
      req.flash('error_messages', '內容不可空白')
      res.redirect('/')
    }
    // return res.json({status: 'success', existTweet})
    await Reply.create({ UserId, TweetId, comment })
    return res.redirect('back')
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
