const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetsController = {
  getTweets: async (req, res, next) => {
    try {
      const loginUserId = helpers.getUser(req) && helpers.getUser(req).id
      const tweetList = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, attributes: ['name', 'account', 'avatar'] },
          { model: User, as: 'LikedBy' },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })

      const tweets = tweetList
        .map(tweet => {
          return tweet.get({ plain: true })
        })
        .map(tweet => {
          return {
            ...tweet,
            Replies: tweet.Replies.length,
            Likes: tweet.Likes.length,
            isLiked: tweet.LikedBy.some(item => item.id === loginUserId)
          }
        })
      // 右側topUsers, sort by跟隨者follower數量 & isFollowed 按鈕
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users
        .map(user => {
          return user.get({ plain: true })
        })
        .map(u => {
          return {
            ...u,
            Followers: u.Followers.length,
            isFollowed:
              helpers.getUser(req) &&
              helpers.getUser(req).Followings &&
              helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
          }
        })
        .sort((a, b) => b.Followers - a.Followers)
        .slice(0, 10)
      return res.render('index', { tweets, topUsers, page: 'tweets' })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const loginUserId = helpers.getUser(req) && helpers.getUser(req).id
      const { tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId, {
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: User, as: 'LikedBy' },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      const result = tweet.get({ plain: true })
      result.Replies = tweet.Replies.length
      result.Likes = tweet.Likes.length
      result.isLiked = tweet.LikedBy.some(item => item.id === loginUserId)
      const replies = await Reply.findAll({
        where: { tweetId },
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        },
        raw: true,
        nest: true
      })

      // 右側topUsers, sort by跟隨者follower數量 & isFollowed 按鈕
      const users = await User.findAll({
        where: { isAdmin: false },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: { model: User, as: 'Followers' }
      })
      const topUsers = users
        .map(user => {
          return user.get({ plain: true })
        })
        .map(u => {
          return {
            ...u,
            Followers: u.Followers.length,
            isFollowed:
              helpers.getUser(req) &&
              helpers.getUser(req).Followings &&
              helpers.getUser(req).Followings.some(f => f.id === Number(u.id))
          }
        })
        .sort((a, b) => b.Followers - a.Followers)
        .slice(0, 10)

      return res.render('tweet', { tweet: result, replies, topUsers })
    } catch (err) {
      next(err)
    }
  },
  addTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req) && helpers.getUser(req).id
    try {
      if (!description || description.trim().length === 0) {
        throw new Error('內容不可空白！')
      }
      if (description.length > 140) throw new Error('推文不能超過140字！')
      await Tweet.create({
        description,
        UserId
      })
      return res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  addReply: async (req, res, next) => {
    const TweetId = Number(req.params.tweetId)
    const UserId = helpers.getUser(req) && helpers.getUser(req).id
    const { comment } = req.body

    try {
      if (!comment || comment.trim().length === 0) {
        throw new Error('不能發空白回覆！')
      }
      if (comment.length > 140) throw new Error('推文不能超過140字！')
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
module.exports = tweetsController
