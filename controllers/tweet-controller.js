const { getTop10Following } = require('../helpers/getTop10Following-helper')
const { Tweet, User, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    const tweetRoute = true
    const userId = helpers.getUser(req).id
    try {
      const user = await User.findByPk(userId, { raw: true, nest: true })
      const userAvatar = user.avatar

      const tweets = await Tweet.findAll({
        group: 'Tweet.id',
        attributes: [
          'id',
          'description',
          'createdAt',
          'updatedAt',
          [
            sequelize.fn(
              'COUNT',
              sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
            ),
            'likesLength'
          ],
          [
            sequelize.fn(
              'COUNT',
              sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
            ),
            'repliesLength'
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM likes where User_id = ${userId} AND Tweet_id = Tweet.id)`
            ),
            'isLiked'
          ]
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] }
        ]
      })
      const top10Followers = await getTop10Following(req, next)
      return res.render('tweets', {
        tweets,
        topFollowers: top10Followers,
        tweetRoute,
        userAvatar,
        userId
      })
    } catch (err) {
      next(err)
    }
  },
  getTweetReplies: async (req, res, next) => {
    const userId = helpers.getUser(req).id
    try {
      const user = await User.findByPk(userId, { raw: true, nest: true })
      const userAvatar = user.avatar || 'https://i.imgur.com/mhXz6z9.png?1'
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [User],
        raw: true,
        nest: true
      })
      // console.log(tweet)
      const replies = await Reply.findAll({
        where: { Tweet_id: req.params.id },
        include: [User, { model: Tweet, include: User }],
        raw: true,
        nest: true
      })

      const likes = await Like.findAll({
        where: { Tweet_id: req.params.id },
        raw: true,
        nest: true
      })
      const isLiked = likes.some(like => like.UserId === userId)
      const top10Followers = await getTop10Following(req, next)
      const replyQuantity = replies.length
      const likeQuantity = likes.length
      return res.render('reply-list', {
        tweet,
        replies,
        replyQuantity,
        likeQuantity,
        isLiked,
        topFollowers: top10Followers,
        userId,
        userAvatar
      })
    } catch (err) {
      next(err)
    }
  },
  postTweetReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      if (!comment) throw new Error('內容不可為空白')
      const tweet = await Tweet.findByPk(tweetId)
      const user = await User.findByPk(userId)
      if (!tweet) throw new Error('推文不存在')
      if (!user) throw new Error('使用者不存在')
      await Reply.create({
        comment,
        userId,
        tweetId
      })
      return res.redirect(`/tweets/${tweetId}/replies`)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const userId = helpers.getUser(req).id
      if (!description) throw new Error('內容不可為空白')
      if (description.length > 140) throw new Error('內容不可超過140字')
      const user = await User.findByPk(userId)
      if (!user) throw new Error('使用者不存在')
      await Tweet.create({
        description,
        UserId: userId
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
