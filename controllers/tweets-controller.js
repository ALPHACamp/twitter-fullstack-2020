const { User, Followship, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const tweetsController = {
  getTweets: async (req, res, next) => {
    const UserId = helpers.getUser(req).id
    try {
      let [user, tweets] = await Promise.all([
        User.findByPk(UserId, {
          raw: true,
          nest: true
        }),
        Tweet.findAll({
          include: [
            User,
            { model: Like },
            { model: Reply, include: User }
          ],
          order: [['createdAt', 'DESC']]
        })
      ])
      tweets = tweets.map(tweet => ({
        likeCount: tweet.Likes.length,
        replyCount: tweet.Replies.length,
        ...tweet.toJSON(),
        isLiked: helpers.getUser(req) && helpers.getUser(req).Likes.some(like => like.TweetId === tweet.id)
      }))
      const partialName = 'tweets'
      res.render('index', {
        user,
        tweets: tweets,
        partialName
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    const { tweetId } = req.params
    const user = helpers.getUser(req)
    console.log(user)
    try {
      const tweet = await Tweet.findByPk(tweetId, {
        include: [
          User,
          { model: Like },
          { model: Reply, include: User }
        ]
      })
      const likeCount = tweet.Likes.length
      const replyCount = tweet.Replies.length
      const isLiked = tweet.Likes.some(l => l.dataValues.UserId === user.id)
      // 按照發文順序顯示
      tweet.Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt)
      const partialName = 'tweet'
      res.render('index', {
        tweet: tweet.toJSON(),
        user,
        likeCount,
        replyCount,
        isLiked,
        partialName
      })
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('推文內容不能為空白!')
    try {
      await Tweet.create({
        UserId,
        description
      })
      res.redirect('tweets')
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    const { comment } = req.body
    const TweetId = req.params.tweetId
    const UserId = helpers.getUser(req).id
    if (!comment) throw new Error('回覆內容不能為空白!')
    try {
      await Reply.create({
        UserId,
        TweetId,
        comment
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetsController
