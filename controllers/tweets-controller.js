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
          include: User,
          order: [['createdAt', 'DESC']]
        })
      ])
      console.log(helpers.getUser(req).Likes)
      tweets = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: helpers.getUser(req) && helpers.getUser(req).Likes.some(like => like.TweetId === tweet.id)
      }))
      res.render('tweets', {
        user,
        tweets: tweets
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    const { tweetId } = req.params
    const UserId = helpers.getUser(req).id
    try {
      const [tweet, user] = await Promise.all([
        Tweet.findByPk(tweetId, {
          include: [User, { model: Like }, { model: Reply, include: User }]
        }),
        User.findByPk(UserId)
      ])
      const likeCount = tweet.Likes.length
      const replyCount = tweet.Replies.length
      const isLiked = tweet.Likes.some(l => l.dataValues.UserId === UserId)
      res.render('tweet', {
        tweet: tweet.toJSON(),
        user: user.toJSON(),
        likeCount,
        replyCount,
        isLiked
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
      res.redirect(`/tweets/${TweetId}/replies`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetsController
