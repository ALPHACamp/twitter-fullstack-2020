const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')
const getTopUser = require('../helpers/top-user-helper')

const tweetController = {
  getTweetReplies: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId, {
        include: [{ model: Reply, include: User }, User, Like],
        order: [[Reply, 'createdAt', 'desc']]
      })
      if (!tweet) throw new Error("This tweet didn't exist!")
      const data = tweet.toJSON()
      const isLiked = data.Likes.some(t => t.UserId === currentUser.id)
      const topUser = await getTopUser(currentUser)

      return res.render('tweets/tweet-replies', {
        tweet: data,
        isLiked,
        currentUser,
        role: currentUser.role,
        topUser
      })
    } catch (err) {
      next(err)
    }
  },
  postTweetReply: async (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const comment = req.body.comment
    const TweetId = req.params.id
    const existTweet = Tweet.findByPk(TweetId)
    if (!existTweet) {
      req.flash('error_messages', '這個推文已經不存在！')
      res.redirect('/')
    }
    if (!comment) {
      req.flash('error_messages', '內容不可空白')
      res.redirect('back')
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
      await Like.create({ UserId, TweetId })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
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
      if (!UserId) {
        return res.redirect(302, '/signin')
      }
      const description = req.body.description
      if (!description.trim()) throw new Error('推文內容不可為空白')
      if (description.length > 140) {
        return res.redirect(302, 'back')
      }
      await Tweet.create({ description, UserId })
      return res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const followingsId = currentUser.Followings.map(user => user.id)
      const topUser = await getTopUser(currentUser)
      const tweets = await Tweet.findAll({
        where: { UserId: [...followingsId, currentUser.id] },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'description', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      const likedTweetsId = req.user?.Likes
        ? currentUser.Likes.map(lt => lt.TweetId)
        : []
      const data = tweets.map(tweets => ({
        ...tweets.toJSON(),
        isLiked: likedTweetsId.includes(tweets.id)
      }))
      res.render('tweets', {
        tweets: data,
        role: currentUser.role,
        currentUser,
        topUser
      })
      // res.json({ status: 'success', tweets: data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
